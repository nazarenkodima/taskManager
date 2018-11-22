// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {

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

        return (
            <li className = { Styles.task } >
                <div className = { Styles.content }>
                    <Checkbox className = { Styles.toggleTaskCompletedState } color1 = '#3b8ef3' color2 = '#FFF' inlineBlock />
                    <input disabled maxLength = '50' type = 'text' />
                </div>
                <div className = { Styles.actions }>
                    <Star className = { Styles.toggleTaskFavoriteState } color1 = '#3b8ef3' color2 = '#00' inlineBlock />
                    <Edit className = { Styles.updateTaskMessageOnClick } color1 = '#3b8ef3' color2 = '#00' inlineBlock />
                    <Remove color1 = '#3b8ef3' color2 = '#000' inlineBlock />
                </div>
            </li>);
    }
}
