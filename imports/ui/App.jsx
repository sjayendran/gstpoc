import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import { Invoices } from '../api/invoices.js';
import Task from './Task.jsx';

//App Component - represents the whole App
class App extends Component {
    constructor(props){
      super(props);

      this.state = {
        hideCompleted: false,
        fileUploading: false
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

    selectFileViaDupeButton(){
      ReactDOM.findDOMNode(this.refs.fileUpload).click();
    }

    showLoadingButton(){

    }

    fileSelected(){
      //alert('a new file has been selected!');
      //console.log(this.refs.fileUpload.files[0]);
      if (this.refs.fileUpload.files && this.refs.fileUpload.files[0]) {
        // We upload only one file, in case
        // multiple files were selected
        var upload = Invoices.insert({
          file: this.refs.fileUpload.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        upload.on('start', function () {
          //currentUpload.set(this);
          this.state.fileUploading = true;
        });

        upload.on('end', function (error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            alert('File "' + fileObj.name + '" successfully uploaded');
            Meteor.call('getExcelDetails', fileObj);
          }
          //currentUpload.set(false);
          this.state.fileUploading = false;
        });

        upload.start();
      }
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
    const permanentlyHideBasicUploadButtonStyle = {display: 'none'};

    return (
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="block">
              <h1 className="title">GST POC</h1>
              <input style={permanentlyHideBasicUploadButtonStyle} id="fileInput" accept=".xls,.xlsx,.xlsm" type="file" ref="fileUpload" onChange={this.fileSelected.bind(this)}/>
              {this.state.fileUploading && }
              <a ref="dupeUploadBtn" className="button is-primary is-large" onClick={this.selectFileViaDupeButton.bind(this)}>Upload Invoice</a>
              <a ref="uploadInProgressBtn" className="button is-primary is-loading"></a>
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

  /* OLD base To DO list markup
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
  </div>*/
