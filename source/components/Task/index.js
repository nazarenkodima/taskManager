// Core
import React, { PureComponent } from 'react';
import { Transition } from 'react-spring';

import { bool, string } from 'prop-types';

import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        completed: bool.isRequired,
        favorite:  bool.isRequired,
        id:        string.isRequired,
        message:   string.isRequired,
    };

    state = {
        newMessage:    this.props.message,
        isTaskEditing: false,
    }

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,

    });

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(
            this._getTaskShape({
                favorite: !favorite,
            })
        );
    };

    _setTaskEditingState (status) {
        this.setState({ isTaskEditing: status }, () => {
            if (status) {
                this.taskInput.current.focus();
            }
        });
    }

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTask = () => {
        const { newMessage } = this.state;
        const { _updateTaskAsync, message } = this.props;

        this._setTaskEditingState(false);

        if (newMessage === message) {
            return null;
        }
        _updateTaskAsync(this._getTaskShape({ message: newMessage }));
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    }

    _cancelUpdatingTaskMessage = () => {
        this.setState((state, props) => ({
            isTaskEditing: false,
            newMessage:    props.message,
        }));
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;
        const enterKey = event.key === "Enter";
        const escapeKey = event.key === "Escape";

        if (!newMessage.trim()) {
            return null;
        }

        if (enterKey) {
            this._updateTask();
        }

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        }
    }

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { completed, favorite } = this.props;

        return (
            <li
                className = { cx(Styles.task, { [Styles.completed]: completed }) }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        height = { 19 }
                        width = { 19 }
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        height = { 19 }
                        width = { 19 }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        height = { 19 }
                        width = { 19 }
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        height = { 19 }
                        width = { 19 }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
