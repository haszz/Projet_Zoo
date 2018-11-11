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
  Input,
  Row
} from 'reactstrap';


class SearchCage extends Component {
  constructor(props) {
      super(props);
      this.state = {
        nom: '',
        description: '',
        taille: ''};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault()
    var name = event.target.name;
   
        this.setState({ [name]:event.target.value});

    
  }
  


  handleSubmit(event) {
    event.preventDefault()
    let url = "";
      if(this.state.nom != ''){
        if(url.length >0){
          url += "&nom="+this.state.nom
        }else{
          url += "nom="+this.state.nom
        }
      }
      if(this.state.description != ''){
        if(url.length >0){
        url += "&description="+this.state.description
        }else{
          url += "description="+this.state.description
        }
      }
      if(this.state.taille != ''){
        if(url.length >0){
        url += "&taille="+this.state.taille
        }else{
          url += "taille="+this.state.taille
        }
      }
      if(url !== ""){
      this.props.history.push('/cages/search/'+url)
      }
    console.log(url);

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
        <h6 className="display-4">Recherche cages</h6>
        <p className="lead">tous les champs ne sont pas obligatoire.</p>
      </Container>
    </Jumbotron>

    
<Container>
        <Form onSubmit={this.handleSubmit}>
      <FormGroup row>

          
        <Label for="nom" sm={2} >

            Nom
          </Label>

        <Col sm={10} >
          <Input value={this.state.value} onChange={this.handleChange} type="text" name="nom" id="nom" placeholder="George"  />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="description" sm={2}>Description</Label>
        <Col sm={10}>
          <Input value={this.state.value} onChange={this.handleChange} type="texte" name="description" id="description" placeholder="Cage verte..."  />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="taille" sm={2}>Taille</Label>
        <Col sm={10}>
          <Input value={this.state.value} onChange={this.handleChange} type="number" name="taille" id="taille"  placeholder="23"  />
        </Col>
      </FormGroup>
  
      <FormGroup  row>
        <Col sm={{ size: 10 }} >
        <Button  color="primary"><FontAwesomeIcon icon={Icons.faSearch}/> Rechercher</Button>{' '}
        <Link to={{ pathname: this.props.location.state.from, state: { from: '/searchCage'} }}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>


      
         
        </Col>
      </FormGroup>
      
    </Form>
    </Container>
    </div>
      );
  }
}
export default  SearchCage;