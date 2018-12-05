// Core
import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTask: PropTypes.func.isRequired,
        completed:   PropTypes.bool.isRequired,
        favorite:    PropTypes.bool.isRequired,
        id:          PropTypes.string.isRequired,
        message:     PropTypes.string.isRequired,
    };

    state = {
        newMessage: this.props.message,
    }

    taskInput = React.createRef();

    _favoriteTask = () => {
        const { _favoriteTask, favorite } = this.props;

        console.log(this.props);

        _favoriteTask(
            this._getTaskShape({
                favorite: !favorite,
            })
        );
    };

    _removeTask = () => {
        const { _removeTask, id } = this.props;

        _removeTask(id);
    }

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

    render () {
        const { message, completed, favorite } = this.props;

        return (
            <li
                className = { cx(Styles.task, {
                    [Styles.completed]: completed,
                }) }>
                <div className = { Styles.content }>
                    <Checkbox className = { Styles.toggleTaskCompletedState } color1 = '#3b8ef3' color2 = '#FFF' inlineBlock />
                    <input
                        disabled maxLength = '50'
                        ref = { this.taskInput }
                        type = 'text' value = { message }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star className = { Styles.toggleTaskFavoriteState } color1 = '#3b8ef3' color2 = '#00' inlineBlock onClick = { this._favoriteTask } checked = { favorite } />
                    <Edit className = { Styles.updateTaskMessageOnClick } color1 = '#3b8ef3' color2 = '#00' inlineBlock />
                    <Remove color1 = '#3b8ef3' color2 = '#000' inlineBlock onClick = { this._removeTask } />
                </div>
            </li>);
    }
}
