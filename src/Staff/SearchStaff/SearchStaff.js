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
  
  
  class SearchStaff extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault()
        let formData = new FormData(event.target);
        let nom=formData.get('nom');
        let prenom=formData.get('prenom');
        let salaire=formData.get('salaire');
        let url = "";
          if(nom != ''){
            if(url.length >0){
              url += "&nom="+nom
            }else{
              url += "nom="+nom
            }
          }
          if(prenom != ''){
            if(url.length >0){
            url += "&prenom="+prenom
            }else{
              url += "prenom="+prenom
            }
          }
          if(salaire != ''){
            if(url.length >0){
            url += "&salaire="+salaire
            }else{
              url += "salaire="+salaire
            }
          }
          if(url !== ""){
          this.props.history.push('/staffs/search/'+url)
          }
        console.log(url);
  
    } 
  
  
    render() {
    
        return (
    <div>
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">Recherche de personnel</h6>
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
            <Input type="text" name="nom" id="nom" placeholder="Dupond"  />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="prenom" sm={2}>Prenom</Label>
          <Col sm={10}>
            <Input  type="texte" name="prenom" id="prenom" placeholder="Thomas"  />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="Salaire" sm={2}>Salaire (en €)</Label>
          <Col sm={10}>
            <Input type="number" name="salaire" id="salaire"  placeholder="1493"  />
          </Col>
        </FormGroup>
    
        <FormGroup  row>
          <Col sm={{ size: 10 }} >
          <Button  color="primary"><FontAwesomeIcon icon={Icons.faSearch}/> Rechercher</Button>{' '}
          <Link to={{ pathname: this.props.location.state.from, state: { from: '/searchStaff'} }}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
          </Col>
        </FormGroup>
        
      </Form>
      </Container>
      </div>
        );
    }
  }
  export default  SearchStaff;