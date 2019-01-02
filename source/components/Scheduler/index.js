// Core
import React, { Component } from 'react';

//components
import Spinner from '../../components/Spinner';
import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST';
import { sortTasksByGroup } from '../../instruments';
import FlipMove from "react-flip-move";

export default class Scheduler extends Component {

    state = {
        newTaskMessage: '',
        tasks:          [],
        isSpinning:     false,
        tasksFilter:    '',
    };

    componentDidMount () {
        this._setTasksFetchingState(true);
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    }

    _getAllCompleted = () => this.state.tasks.every((task) => task.completed);

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
        });

        this._setTasksFetchingState(false);

    }

    _createTaskAsync = async (event) => {

        const { newTaskMessage } = this.state;

        if (!newTaskMessage.trim()) {
            return null;
        }

        this._setTasksFetchingState(true);

        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);

    }

     _removeTaskAsync = async (id) => {
         this._setTasksFetchingState(true);

         const { tasks } = this.state;

         await api.removeTask(id);

         const newTasks = tasks.filter((task) => {
             return task.id !== id;
         });

         this.setState({
             tasks: newTasks,
         });

         this._setTasksFetchingState(false);

     }

     _updateTaskAsync = async (taskToUpdate) => {
         this._setTasksFetchingState(true);

         const tasksToUpdate = await api.updateTask(taskToUpdate);

         this.setState(({ tasks }) => ({
             tasks: tasks.map((task) => {
                 const updatedTask = tasksToUpdate.find((updateTask) => task.id === updateTask.id);

                 return updatedTask ? updatedTask : task;
             }),
         }));

         this._setTasksFetchingState(false);

     }

     _completeAllTasksAsync = async () => {
         this._setTasksFetchingState(true);

         if (this._getAllCompleted()) {
             return null;
         }

         const { tasks } = this.state;

         await api.completeAllTasks(tasks);

         const completedTasks = tasks.map((task) => ({ ...task, completed: true }));

         this.setState({
             tasks: completedTasks,
         });

         this._setTasksFetchingState(false);

     }

     _handleFormSubmit = (event) => {
         event.preventDefault();
         this._submitTask();
     }

     _submitTask = () => {
         const { newTaskMessage } = this.state;

         if (!newTaskMessage) {
             return null;
         }

         this._createTaskAsync(newTaskMessage);

         this.setState({
             newTaskMessage: '',
         });
     }

     _filterTasks = (task) => {
         const { tasksFilter } = this.state;

         return task.message.toLowerCase().includes(tasksFilter);
     };

     _updateTasksFilter = (event) => {
         this.setState({
             tasksFilter: event.target.value.toLocaleLowerCase(),
         });
     };

     _animateComposerEnter (composer) {
         fromTo(composer, 1, { opacity: 0, rotationX: 50 }, { opacity: 1, rotationX: 0 });
     }

     render () {
         const { tasks, newTaskMessage, isTasksFetching, tasksFilter } = this.state;

         const taskJSX = sortTasksByGroup(tasks.filter(this._filterTasks)).map((task) =>
             (
                 <Task
                     key = { task.id }
                     { ...task }
                     _removeTaskAsync = { this._removeTaskAsync }
                     _updateTaskAsync = { this._updateTaskAsync }
                 />

             )
         );

         const allcompletedTasks = this._getAllCompleted();

         return (
             <section className = { Styles.scheduler }>
                 <Spinner isSpinning = { isTasksFetching } />

                 <main>
                     <header>
                         <h1> Планировщик задач</h1>
                         <input
                             maxLength = { 50 }
                             placeholder = 'Поиск'
                             type = 'search'
                             value = { tasksFilter }
                             onChange = { this._updateTasksFilter }
                         />
                     </header>
                     <section>
                         <form onSubmit = { this._handleFormSubmit }>
                             <input
                                 maxLength = { 50 }
                                 placeholder = { `Описaние моей новой задачи` }
                                 type = 'text'
                                 value = { newTaskMessage }
                                 onChange = { this._updateNewTaskMessage }
                             />
                             <button type = 'submit'>Добавить задачу</button>
                         </form>
                         <div>
                             <ul >
                                 <FlipMove>{taskJSX}</FlipMove>
                             </ul>

                         </div>
                     </section>
                     <footer>
                         <Checkbox
                             checked = { allcompletedTasks }
                             color1 = '#363636'
                             color2 = '#fff'
                             inlineBlock
                             onClick = { this._completeAllTasksAsync }
                         />
                         <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                     </footer>
                 </main>
             </section>
         );
     }
}
