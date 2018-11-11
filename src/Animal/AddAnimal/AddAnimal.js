import React, {
    Component
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { Link } from 'react-router-dom';
import {
  Alert,
  Col,
  CustomInput ,
    Button,
    Form,
    Container,
    Jumbotron,
    FormGroup,
    Label,
    Input
} from 'reactstrap';


class AddAnimal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cages: [],
            isAdded: false,
            error: null };
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
      this.getCageList();
    }


    handleSubmit(event) {
      event.preventDefault()
      const data = new URLSearchParams(new FormData(event.target));
      let u = 'http://localhost:3000/animals/';
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
    getCageList() {
      fetch('http://localhost:3000/cages')
      .then(result=>result.json())
    .then(items=>this.setState({cages: items}))
    .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
        
    }

    render() {
      const { error, isAdded } = this.state;
      const cages = this.state.cages.map((item, i) => (
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
            L'animal a été ajouté avec succès.
          </Alert>
          <Link to={'/animals'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faKiwiBird}/> Voir la liste des animeaux</Button></Link>
          </Col>
          );
        }
       
    
        return (
          <div>
              <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">Ajouter un animal</h6>
          <p className="lead"></p>
        </Container>
      </Jumbotron>
      
          <Container>
    
          <Form onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="text" name="nom" id="nom" placeholder="George" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="race" sm={2}>Race</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="texte" name="race" id="race" placeholder="Labrador" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="nourritureParJour" sm={2}>Nourriture par jour (en Kg)</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="number" name="nourritureParJour" id="nourritureParJour" placeholder="23" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="dateDeNaissance" sm={2}>Date de naissance</Label>
          <Col sm={10}>
            <Input type="date" name="dateDeNaissance" id="dateDeNaissance" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="dateEntreeZoo" sm={2}>Date d'entrée au zoo</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="date" name="dateEntreeZoo" id="dateEntreeZoo" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="cage" sm={2}>Cage</Label>
          <Col sm={10}>
          <CustomInput type="select" id="cage" name="idCage" value={this.state.value} onChange={this.handleChange}>
              {cages}
          </CustomInput>
        
          </Col>
        </FormGroup>
        <FormGroup  row>
          <Col sm={{ size: 10 }} >
          <Button  color="primary"><FontAwesomeIcon icon={Icons.faPaperPlane}/> Envoyer</Button>{' '}
          <Link to={this.props.location.state.from}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
{' '}

          <Link to={{ pathname: '/addCage', state: { from: '/addAnimal'} }}> <Button outline color="secondary"><FontAwesomeIcon icon={Icons.faPlusCircle}/> Ajouter une cage</Button></Link>
          
          
           
          </Col>
        </FormGroup>
        
      </Form>
      </Container>
      </div>
        );
    }
}
export default  AddAnimal;