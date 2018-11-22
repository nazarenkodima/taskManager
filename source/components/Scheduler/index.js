// Core
import React, { Component } from 'react';

//components
import { Provider } from '../HOC/context';
import { Consumer } from '../HOC/context';

import Checkbox from '../../theme/assets/Checkbox';
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    constructor () {
        super();
        this.state = {
            items:       '',
            currentItem: { text: '', key: '' },
        };

        this._handleChange = this._handleChange.bind(this);
        this._handleClick = this._handleClick.bind(this);

    }

    _handleChange = (e) => {
        this.setState({
            task: e.target.value,
        });
        console.log(this.state);
    }

    _handleClick = (e) => {
        e.preventDefault();
    }

    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = { `Поиск` } type = 'search' />
                    </header>
                    <section>
                        <form>
                            <input maxLength = '50' placeholder = { `Описaние моей новой задачи` } type = 'text' value = { this.state.task } onChange = { this._handleChange } />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                {/* <Task /> */}
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
