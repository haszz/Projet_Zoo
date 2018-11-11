import React, {
    Component
} from 'react';

import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {
  Alert,
  Col,
  Jumbotron ,
    Button,
    Form,
    FormGroup,
    Label,
    CustomInput,
    Input,
 
    Container
} from 'reactstrap';


class UpdateFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            food: [],
            isAdded: false,
            error: null,
            foodId: this.props.match.params.foodId};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        this.getAnimalList();
      this.getFoodInfo();
    }
    getAnimalList() {
        fetch('http://localhost:3000/animals')
        .then(result=>result.json())
      .then(items=>this.setState({animals: items}))
      .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));;
      }
    handleSubmit(event) {
      event.preventDefault()
      let formData = new FormData(event.target);
      const data = new URLSearchParams(formData);
      let u = 'http://localhost:3000/foods/'+this.state.foodId;
      console.log(data);
      fetch(u, {
          method: 'put',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data,
      }).then( this.setState({  isAdded: true }))
      .catch(error => this.setState({ error }));


    } 
    getAnimals(id){
        var s = '';
        for (var i = 0; i < this.state.animals.length; i++) {
          if(this.state.animals[i].id === id){
            s += '<option value='+this.state.animals[i].id+'>'+this.state.animals[i].nom+'</option>';
          }
      }
      for (var i = 0; i < this.state.animals.length; i++) {
        if(this.state.animals[i].id !== id){
          s += '<option value=\''+this.state.animals[i].id+ '\' key=\''+this.state.animals[i].id+'\' \'>'+this.state.animals[i].nom+'</option>';
        }
    }
    return ReactHtmlParser(s);
}
    getFoodInfo() {
        let u = 'http://localhost:3000/foods/'+this.state.foodId;
        console.log(u);
      fetch(u)
      .then(result=>result.json())
    .then(items=>this.setState({food: items}))
    }

    render() {
      const { error, isAdded } = this.state;
      let message =  this.state.food.map((item, i) => (
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">{item.nom}</h6>
          <p className="lead">Vous pouvez modifier les informations de la nourriture "{item.nom}" dans les champs suivants.</p>
        </Container>
      </Jumbotron>

      ));
      const food = this.state.food.map((item, i) => (
          <div>
        
        <Form key="updateForm" onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input defaultValue={item.nom} type="text" name="nom" id="nom" placeholder="George" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="quantiteNourriture" sm={2}>Quantite (en Kg)</Label>
          <Col sm={10}>
            <Input defaultValue={item.quantiteNourriture}  type="number" name="quantiteNourriture" id="quantiteNourriture" placeholder="23" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="animal" sm={2}>Animal</Label>
          <Col sm={10}>
          <CustomInput type="select" id="idAnimal" name="idAnimal" >
          {this.getAnimals(item.idAnimal)}
          </CustomInput>
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 1 }}>
           <Button  color="primary"><FontAwesomeIcon icon={Icons.faPaperPlane}/> Modifier les informations</Button>
           {' '}<Link to={this.props.location.state.from}><Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
          </Col>
        </FormGroup>
        </Form>
        </div>
        ));

        if (error) {
          return (<Col> <Alert color="danger">
          {this.state.error.message}
        </Alert>
        <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
        </Col>);
        }
        if (isAdded) {
          return  ( <Col> <Alert color="success">
            Les informations ont été modifié avec succès.
          </Alert>
            <Link to={'/foods'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faHome}/> Voir la liste des nourritures</Button>
            </Link> 
          </Col>
          );
        }
       
    
        return (
         <div>
   {message}
   <Container>
         {food}
         
           
        </Container>
        </div>
        );
    }
}
export default  UpdateFood;