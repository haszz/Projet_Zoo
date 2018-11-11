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
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';


class AddCage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cages: [],
            isAdded: false,
            error: null };
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    


    handleSubmit(event) {
      event.preventDefault()
      const data = new URLSearchParams(new FormData(event.target));
      let u = 'http://localhost:3000/cages/';
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

        if (error) {
          return(<Col> <Alert color="danger">
          {this.state.error.message}
        </Alert>
        <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
        </Col>);
        }
        if (isAdded) {
          return  ( <Col> <Alert color="success">
            La cage a été ajouté avec succès.
          </Alert>
          <Link to={'/cages'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faHome}/> Voir la liste des cages </Button></Link> 
          {' '}<Link to={'/addAnimal'}> <Button outline color="secondary"><FontAwesomeIcon icon={Icons.faPlusCircle}/> Ajouter un animal</Button></Link>
          
          
          </Col>
          );
        }
       
    
        return (
    <div>
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">Ajouter une cage</h6>
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
          <Label for="description" sm={2}>Description</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="texte" name="description" id="description" placeholder="Cage verte..." required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="taille" sm={2}>Taille</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="number" name="taille" id="taille" placeholder="23" required />
          </Col>
        </FormGroup>
    
        <FormGroup  row>
          <Col sm={{ size: 10 }} >
          <Button  color="primary"><FontAwesomeIcon icon={Icons.faPaperPlane}/> Envoyer</Button>{' '}
          <Link to={{ pathname: this.props.location.state.from, state: { from: '/animals'} }}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>


        
           
          </Col>
        </FormGroup>
        
      </Form>
      </Container>
      </div>
        );
    }
}
export default  AddCage;