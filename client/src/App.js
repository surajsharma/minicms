import React, { Component } from "react";
import axios from "axios";
import './App.css'

class App extends Component {
  state = {
    data: [],
    id: null,
    name: '',
    city:'',
    loc:'',
    desc:'',
    lat:'',
    lon:'',
    lm1:'',
    lm2:'',
    updating:false,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  putDataToDB = hostel => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      name: hostel.name,
      city: hostel.city,
      loc:  hostel.loc,
      desc: hostel.desc,
      lat:  hostel.lat,
      lon:  hostel.lon,
      lm1:  hostel.lm1,
      lm2: hostel.lm2
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  };

  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    console.log('del')

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
    document.getElementById('input_forms').reset();
  };

  updateDB = (idToUpdate, updateToApply) => {

    console.log(idToUpdate)

    let objIdToUpdate = null;

    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
      this.setState({
        name: dat.name,
        city: dat.city,
        loc: dat.loc,
        desc: dat.desc,
        lat: dat.lat,
        lon: dat.lon,
        lm1: dat.lm1,
        lm2: dat.lm2,
        updating: !this.state.updating
      })      
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { 
        name: this.state.name,
        city: this.state.city,
        loc:  this.state.loc,
        desc: this.state.desc,
        lat:  this.state.lat,
        lon:  this.state.lon,
        lm1:  this.state.lm1,
        lm2:  this.state.lm2
      }
    });
  };


  render() {
    const { data } = this.state;
    const hostel = {
      name: this.state.name,
      city: this.state.city,
      loc: this.state.loc,
      desc: this.state.desc,
      lat: this.state.lat,
      lon: this.state.lon,
      lm1: this.state.lm1,
      lm2: this.state.lm2
    }
    
    return (
      <div className='container'>
          <h1 className='title is-3'> ZOLO HOSTEL CMS</h1>
          <h2 className='subtitle is-4'>A full MERN stack implementation by <a href="https://github.com/surajsharma">@surajsharma</a></h2>
          <div className='content'>
            <div className='controls box'> 
              <div style={{ padding: "10px" }}>
                <form id='input_forms'>
                  <input
                    value={this.state.name}
                    className='input'
                    type="text"
                    onChange={e => this.setState({name: e.target.value })}
                    placeholder="Hostel name"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.city}
                    className='input'
                    type="text"
                    onChange={e => this.setState({city: e.target.value })}
                    placeholder="City"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.loc}
                    className='input'
                    type="text"
                    onChange={e => this.setState({loc: e.target.value })}
                    placeholder="Locality"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.desc}
                    className='input'
                    type="text"
                    onChange={e => this.setState({desc: e.target.value })}
                    placeholder="Description"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.lat}
                    className='input'
                    type="text"
                    onChange={e => this.setState({lat: e.target.value })}
                    placeholder="GPS lat"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.lon}
                    className='input'
                    type="text"
                    onChange={e => this.setState({lon: e.target.value })}
                    placeholder="GPS lon"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.lm1}
                    className='input'
                    type="text"
                    onChange={e => this.setState({lm1: e.target.value } )}
                    placeholder="Landmark 1"
                    style={{ width: "200px" }}
                  /><br />
                  <input
                    value={this.state.lm2}
                    className='input'
                    type="text"
                    onChange={e => this.setState({lm2: e.target.value })}
                    placeholder="Landmark 2"
                    style={{ width: "200px" }}
                  /><br />
                </form>
                <button className='button is-success' onClick={() => this.putDataToDB(hostel)}>
                  ADD
                </button>
              </div>
              <div className='updatedelete'>
                <div style={{ padding: "10px" }}>
                  <input
                    className='input'
                    type="text"
                    style={{ width: "100px" }}
                    onChange={e => this.setState({ idToDelete: e.target.value })}
                    placeholder="item id"
                  /><br />
                  <button className='button is-danger' onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                    DELETE
                  </button>
                </div>
                <div style={{ padding: "10px" }}>
                  <input
                    id='update_input'
                    className='input'            
                    type="text"
                    style={{ width: "100px" }}
                    onChange={e => this.setState({ idToUpdate: e.target.value })}
                    placeholder="item id"
                  /><br />
                  <button className='button is-warning'
                    onClick={() =>
                      this.updateDB(this.state.idToUpdate, this.state.updateToApply)
                    }>
                    {this.state.updating ? 'ACCEPT' : 'UPDATE'}
                  </button>
                </div>
              </div>
            </div>
              <div className='h_list'>
                {data.length <= 0 ? "NO DB ENTRIES YET" : data.map(dat => ( 
                  <div className='box item' key={dat.id}>
                    <span style={{ color: "gray" }}> id: </span> {dat.id}<br/>
                    <span style={{ color: "gray" }}> Name: </span>{dat.name}<br/>
                    <span style={{ color: "gray" }}> City: </span>{dat.city}<br/>
                    <span style={{ color: "gray" }}> Locality: </span>{dat.loc}<br/>
                    <span style={{ color: "gray" }}> Description: </span>{dat.desc}<br/>
                    <span style={{ color: "gray" }}> Lat: </span>{dat.lat}<br/>
                    <span style={{ color: "gray" }}> Lon: </span>{dat.lon}<br/>
                    <span style={{ color: "gray" }}> Landmark: </span>{dat.lm1}<br/>
                    <span style={{ color: "gray" }}> Landmark 2: </span>{dat.lm2}<br/>
                  </div>
                ))}
              </div>        
          </div>        
      </div>
    );
  }
}

export default App;