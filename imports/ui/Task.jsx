import React, { Component, PropTypes } from 'react';
import { Tasks } from '../api/tasks.js'

//Task Component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    //set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: {checked: !this.props.task.checked},
    });
  }

  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  render() {
    //give tasks a different className when they are checked off,
    //so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked' : '';
    return(
      <div className="field">
        <li className={taskClassName}>
          <p className="control">
            <label className="checkbox">
              <input type="checkbox" readOnly checked={this.props.task.checked} onClick={this.toggleChecked.bind(this)} />
              <span className="text">{this.props.task.text}</span>
            </label>
            <button className="delete" onClick={this.deleteThisTask.bind(this)}>
              &times;
            </button>
          </p>
        </li>
      </div>
    );
  }
}

Task.propTypes = {
  //this component gets the task to display through a React prop.
  //we can use proptypes to indicate it is required
  task: PropTypes.object.isRequired,
};
