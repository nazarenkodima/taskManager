// Core
import React, { Component } from 'react';

//components
import Spinner from '../../components/Spinner';
import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN, MAIN_URL } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';

export default class Scheduler extends Component {

    state = {
        message:    '',
        tasks:      [],
        isSpinning: false,
        completed:  false,
        favorite:   false,
    };

    componentDidMount () {
        this._fetchTasks();
    }

    _setIsSpinningStatus (status) {
        this.setState({
            isSpinning: status,
        });
    }

    _updateTask = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    _fetchTasks = async () => {
        this._setIsSpinningStatus(true);

        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        const { data: tasks, meta } = await response.json();

        console.log(tasks);
        this.setState({
            tasks:      sortTasksByGroup(tasks),
            isSpinning: false,
        });
    }

    _createTask = async (message) => {
        this._setIsSpinningStatus(true);

        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        this.setState(({ tasks }) => ({
            tasks:      [task, ...tasks],
            isSpinning: false,
        }));
    }

     _removeTask = async (id) => {
         this._setIsSpinningStatus(true);

         const { tasks } = this.state;

         await fetch(`${MAIN_URL}/${id}`, {
             method:  'DELETE',
             headers: {
                 Authorization: TOKEN,
             },
         });

         const newTasks = tasks.filter((task) => {
             return task.id !== id;
         });

         this.setState({
             tasks:      newTasks,
             isSpinning: false,
         });

     }

     _favoriteTask = async (taskToUpdate) => {
         try {
             this._setIsSpinningStatus(true);
             const { tasks } = this.state;

             const updateTask = await api._updateTaskApi(taskToUpdate);

             const index =  tasks.findIndex((task) => task.id === taskToUpdate.id);

             const updatedTasks = tasks.map(
                 (task, id) => id === index ? updateTask : task
             );
             const sortedUpdatedTasks = sortTasksByGroup(updatedTasks);

             this.setState({
                 tasks:      sortedUpdatedTasks,
                 isSpinning: false,
             });
         } catch ({ message }) {
             console.log(message);
         }

     }

     _handleFormSubmit = (event) => {
         event.preventDefault();
         this._submitTask();
     }

     _submitTask = () => {
         const { message } = this.state;

         if (!message) {
             return null;
         }

         this._createTask(message);

         this.setState({
             message: '',
         });
     }

     _submitOnEnter = (event) => {
         const enterKey = event.key === 'Enter';

         if (enterKey) {
             event.preventDefault();
             this._submitTask();
         }
     }

     render () {
         const { tasks, message, isSpinning } = this.state;

         const taskJSX = tasks.map((task) => {
             return (
                 <Task
                     _createTask = { this._createTask }
                     _favoriteTask = { this._favoriteTask }
                     _removeTask = { this._removeTask }
                     favorite = { task.favorite }
                     key = { task.id }
                     { ...task }
                 />
             );
         });

         return (
             <section className = { Styles.scheduler }>
                 <Spinner isSpinning = { isSpinning } />

                 <main>
                     <header>
                         <h1>Планировщик задач</h1>
                         <input placeholder = { `Поиск` } type = 'search' />
                     </header>
                     <section>
                         <form onSubmit = { this._handleFormSubmit }>
                             <input
                                 maxLength = '50'
                                 placeholder = { `Описaние моей новой задачи` }
                                 type = 'text'
                                 value = { message }
                                 onChange = { this._updateTask }
                                 onKeyPress = { this._submitOnEnter }
                             />
                             <button type = 'submit'>Добавить задачу</button>
                         </form>
                         <div>
                             <ul >
                                 { taskJSX }
                             </ul>
                         </div>
                     </section>
                     <footer>
                         <Checkbox color1 = '#000' color2 = '#FFF' inlineBlock />
                         <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                     </footer>
                 </main>
             </section>
         );
     }
}
