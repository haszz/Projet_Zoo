import React, {
    Component
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { Link } from 'react-router-dom';
import {
  Alert,
  Col,
  Jumbotron ,
  Container,
  CustomInput,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';


class AddFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foods: [],
            animals: [],
            isAdded: false,
            error: null };
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    

    componentDidMount() {
        this.getAnimalList();
      }

      getAnimalList() {
        fetch('http://localhost:3000/animals')
        .then(result=>result.json())
      .then(items=>this.setState({animals: items}))
      .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
          
      }
  
    handleSubmit(event) {
      event.preventDefault()
      const data = new URLSearchParams(new FormData(event.target));
      let u = 'http://localhost:3000/foods/';
      console.log(data);
      fetch(u, {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data,
      }).then( this.setState({  isAdded: true }))
      .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  
    } 


    render() {
      const { error, isAdded } = this.state;
      const animals = this.state.animals.map((item, i) => (
        <option key={item.id} value={item.id} id={item.id}>{item.nom}</option>
        ));
        if (error) {
          return(<Col> <Alert color="danger">
          {this.state.error.message}
        </Alert>
        <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
        </Col>);
        }
        if (isAdded) {
          return  ( <Col> <Alert color="success">
            La nourriture a été ajouté avec succès.
          </Alert>
          <Link to={'/foods'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faHome}/> Voir la liste des nourritures </Button></Link> 
         
          </Col>
          );
        }
       
    
        return (
    <div>
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">Ajouter nourriture</h6>
          <p className="lead"></p>
        </Container>
      </Jumbotron>

      
<Container>
          <Form onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input value={this.state.value} type="text" name="nom" id="nom" placeholder="Viande" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="quantiteNourriture" sm={2}>Quantite (en Kg)</Label>
          <Col sm={10}>
            <Input value={this.state.value} type="number" name="quantiteNourriture" id="quantiteNourriture" placeholder="43" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="animal" sm={2}>Animal</Label>
          <Col sm={10}>
          <CustomInput type="select" id="animal" name="idAnimal" value={this.state.value} onChange={this.handleChange}>
              {animals}
          </CustomInput>
        
          </Col>
        </FormGroup>
    
        <FormGroup  row>
          <Col sm={{ size: 10 }} >
          <Button  color="primary"><FontAwesomeIcon icon={Icons.faPaperPlane}/> Envoyer</Button>{' '}
          
          <Link to={{ pathname: '/foods', state: { from: '/addFood'} }}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
          {' '}<Link to={{ pathname: '/addAnimal', state: { from: '/addFood'} }}> <Button outline color="secondary"><FontAwesomeIcon icon={Icons.faPlusCircle}/> Ajouter un animal</Button></Link>
          
          

        
           
          </Col>
        </FormGroup>
        
      </Form>
      </Container>
      </div>
        );
    }
}
export default  AddFood;