import React, { Component } from 'react';
 import './App.css';
import Animal from './Animal/Animal';
import Cage from './Cage/Cage';
import Food from './Food/Food';
import Menu from './Menu/Menu';
import { BrowserRouter, Route,Switch } from 'react-router-dom';
import AddAnimal from './Animal/AddAnimal/AddAnimal';
import AnimalById from './Animal/AnimalById/AnimalById';
import AddCage from './Cage/AddCage/AddCage';
import AddFood from './Food/AddFood/AddFood';
import CageById from './Cage/CageById';
import Staff from './Staff/Staff';
import AddStaff from './Staff/AddStaff/AddStaff';
import AnimalBySearchParams from './Animal/AnimalBySearchParams/AnimalBySearchParams';
import FoodBySearchParams from './Food/FoodBySearchParams/FoodBySearchParams';
import StaffBySearchParams from './Staff/StaffBySearchParams/StaffBySearchParams';
import CageBySearchParams from './Cage/CageBySearchParams';
import UpdateAnimal from './Animal/UpdateAnimal/UpdateAnimal';
import UpdateCage from './Cage/UpdateCage/UpdateCage';
import UpdateStaff from './Staff/UpdateStaff/UpdateStaff';
import UpdateFood from './Food/UpdateFood/UpdateFood';
import SearchCage from './Cage/SearchCage/SearchCage';
import SearchStaff from './Staff/SearchStaff/SearchStaff';
import SearchFood from './Food/SearchFood/SearchFood';
import SearchAnimal from './Animal/SearchAnimal/SearchAnimal';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { chat: []};

  }

render() {
return (
<div className="App">

<BrowserRouter>
<div>
<Menu/>
<Switch>

 <Route exact path="/" component={ Animal }/>
 <Route exact path="/addAnimal" component={AddAnimal} />
 <Route exact path="/addFood" component={AddFood} />
 <Route exact path="/animals" component={ Animal }/>
 <Route exact path="/animals/:animalId" component={ AnimalById }/>
 <Route exact path="/cages" component={ Cage }/>
 <Route exact path="/foods" component={ Food }/>
 <Route exact path="/staffs" component={ Staff}/>
 <Route exact path="/animals/search/:searchParam" component={ AnimalBySearchParams }/>
 <Route exact path="/staffs/search/:searchParam" component={ StaffBySearchParams }/>
 <Route exact path="/cages/search/:searchParam" component={ CageBySearchParams }/>
 <Route exact path="/foods/search/:searchParam" component={ FoodBySearchParams }/>

 <Route exact path="/cages/:cageId" component={ CageById }/>
 <Route exact path="/addCage" component={ AddCage }/>
 <Route exact path="/addStaff" component={ AddStaff }/>
 <Route exact path="/updateAnimal/:animalId" component={UpdateAnimal}/>
 <Route exact path="/updateFood/:foodId" component={UpdateFood}/>
 <Route exact path="/updateStaff/:staffId" component={UpdateStaff}/>
 <Route exact path="/updateCage/:cageId" component={UpdateCage}/>
 <Route exact path="/searchCage" component={SearchCage}/>
 <Route exact path="/searchStaff" component={SearchStaff}/>
 <Route exact path="/searchAnimal" component={SearchAnimal}/>
 <Route exact path="/searchFood" component={SearchFood}/>
</Switch>
</div>
</BrowserRouter>
</div>
);
}
}
export default App;
