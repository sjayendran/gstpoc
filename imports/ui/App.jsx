import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data'
import { Tasks } from '../api/tasks.js'
import Task from './Task.jsx';
import { FilesCollection } from 'meteor/ostrio:files';

var Invoices = new FilesCollection({
  storagePath: 'assets/app/uploads/Invoices',
  collectionName: 'Invoices',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /xls|xlsx|xlsm/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload an excel file, with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    const self = this;
    if (Meteor.isServer) {
      console.log('file has been successfully uploaded!!!!');
    }
  }
});

//App Component - represents the whole App
class App extends Component {
    constructor(props){
      super(props);

      this.state = {
        hideCompleted: false,
      };
    }

    handleSubmit(event) {
      event.preventDefault();

      //find the text field via the react ref
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

      Tasks.insert({
        text,
        createdAt: new Date(), //current time
      });

      //clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted(){
      this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
    }

    fileSelected(){
      alert('a new file has been selected!');
      console.log(this);
    }

    renderTasks() {
      let filteredTasks = this.props.tasks;
      if (this.state.hideCompleted){
        filteredTasks = filteredTasks.filter(task => !task.checked);
      }
      return filteredTasks.map((task) => (
        <Task key={task._id} task={task} />
      ));
    }

  render() {
    return (
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="box">
            <nav className="level">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title">Todo list ({this.props.incompleteCount})</h1>
                  </div>
                  <div className="level-item">
                    <div className="field">
                      <p className="control">
                        <label className="subtitle">
                          <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}/>
                          Hide Completed Tasks
                        </label>
                      </p>
                    </div>
                  </div>
                </div>
              </nav>
              <div className="box">
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                  <div className="field">
                    <p className="control">
                      <input className="input" type="text" ref="textInput" placeholder="Type to add new tasks"/>
                    </p>
                  </div>
                </form>
                <ul>
                  {this.renderTasks()}
                </ul>
            </div>
          </div>
          <div className="block">
              <input id="fileInput" accept=".xls,.xlsx,.xlsm" type="file" ref="fileUpload" onChange={this.fileSelected.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

  App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
  };

  export default createContainer(() => {
    return {
      tasks: Tasks.find({},{sort: {createdAt: -1 }}).fetch(),
      incompleteCount: Tasks.find({ checked: {$ne: true}}).count(),
    };
  }, App);
