import React, {
  Component
} from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {
Alert,
Col,
CustomInput ,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Jumbotron,
  Container
} from 'reactstrap';


class SearchAnimal extends Component {
  constructor(props) {
      super(props);
      this.state = {
          cages:[]};
      this.handleSubmit = this.handleSubmit.bind(this);

  }
  componentDidMount() {
    this.getCageList();
  }
  getCageList() {
    fetch('http://localhost:3000/cages')
    .then(result=>result.json())
  .then(items=>this.setState({cages: items}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));;
  }
  
  handleSubmit(event) {
    event.preventDefault()
    let formData = new FormData(event.target);

    let regexDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    let dateDeNaissance =formData.get('dateDeNaissance');
         // First check for the pattern
         if(!regexDate.test(dateDeNaissance) && dateDeNaissance !== ""){
          this.setState({ error: new Error("La date de naissance n'est pas valide.") })
          return;
        }
        if(dateDeNaissance !== ""){
    let parts =dateDeNaissance.split('/');
    dateDeNaissance = new Date(parts[2] , parts[1] - 1, parts[0]); 
    dateDeNaissance = moment(dateDeNaissance).format('YYYY-MM-DD');

        }
    let dateEntreeZoo=formData.get('dateEntreeZoo');
         // First check for the pattern
         if(!regexDate.test(dateEntreeZoo) && dateEntreeZoo !== ""){
          this.setState({ error: new Error("La date d'entree au zoo n'est pas valide.") })
          return;
        }
        if( dateEntreeZoo !== ""){
          let parts =dateEntreeZoo.split('/');
          dateEntreeZoo = new Date(parts[2], parts[1] - 1, parts[0]); 
          dateEntreeZoo = moment(dateEntreeZoo).format('YYYY-MM-DD');

        }


    let nom=formData.get('nom');
    let race=formData.get('race');
    let nourritureParJour=formData.get('nourritureParJour');
    let cage=formData.get('idCage');
    let url = "";

    if(nom !== ""){
      if(url.length >0){
        url += "&nom="+nom
      }else{
        url += "nom="+nom
      }
    }
    if(race !== ""){
      if(url.length >0){
        url += "&race="+race
      }else{
        url += "race="+race
      }
    }
    if(nourritureParJour !== ""){
      if(url.length >0){
        url += "&nourritureParJour="+nourritureParJour
      }else{
        url += "nourritureParJour="+nourritureParJour
      }
    }
    if(cage !== ""){
      if(url.length >0){
        url += "&idCage="+cage
      }else{
        url += "idCage="+cage
      }
    }
    if(dateDeNaissance !== ""){
      if(url.length >0){
        url += "&dateDeNaissance="+dateDeNaissance
      }else{
        url += "dateDeNaissance="+dateDeNaissance
      }
    }
    if(dateEntreeZoo !== ""){
      if(url.length >0){
        url += "&dateEntreeZoo="+dateEntreeZoo
      }else{
        url += "dateEntreeZoo="+dateEntreeZoo
      }
    }
    if(url !== ""){
    this.props.history.push('/animals/search/'+url)
    }
    console.log(url);

  } 

  getCages(){
    var s = '';

        s += '<option value=""></option>';
    
  
  for (var i = 0; i < this.state.cages.length; i++) {
 
      s += '<option value=\''+this.state.cages[i].id+ '\' key=\''+this.state.cages[i].id+'\' \'>'+this.state.cages[i].nom+'</option>';
    
}
return ReactHtmlParser(s);
  }

  render() {



  
  
      return (
        <div>
 <Jumbotron fluid >
  <Container fluid>
    <h6 className="display-4">Recherche animaux</h6>
    <p className="lead">tous les champs ne sont pas obligatoire.</p>
  </Container>
</Jumbotron>
      <Container>
      <div style={{marginBottom: 1 + 'em'}}>
   
   <Form key="updateForm" onSubmit={this.handleSubmit}>
   <FormGroup row>
     <Label for="nom" sm={2}>Nom</Label>
     <Col sm={10}>
       <Input value={this.state.value}  type="text" name="nom" id="nom" placeholder="George"  />
     </Col>
   </FormGroup>
   <FormGroup row>
     <Label for="race" sm={2}>Race</Label>
     <Col sm={10}>
       <Input  value={this.state.value} type="texte" name="race" id="race" placeholder="Labrador"  />
     </Col>
   </FormGroup>
   <FormGroup row>
     <Label for="nourritureParJour" sm={2}>Nourriture par jour (en Kg)</Label>
     <Col sm={10}>
       <Input value={this.state.value} type="number" name="nourritureParJour" id="nourritureParJour" placeholder="23"  />
     </Col>
   </FormGroup>
   <FormGroup row>
     <Label for="dateDeNaissance" sm={2}>Date de naissance</Label>
     <Col sm={10}>
       <Input  value={this.state.value}  type="text" name="dateDeNaissance" placeholder="jj/mm/aaaa" id="dateDeNaissance"  />
     </Col>
   </FormGroup>
   <FormGroup row>
     <Label for="dateEntreeZoo" sm={2}>Date d'entrée au zoo</Label>
     <Col sm={10}>
       <Input     value={this.state.value} type="text" placeholder="jj/mm/aaaa" name="dateEntreeZoo" id="dateEntreeZoo"  />
     </Col>
   </FormGroup>
   <FormGroup row>
     <Label for="cage" sm={2}>Cage</Label>
     <Col sm={10}>
     <CustomInput type="select" id="idCage" name="idCage" >
     {this.getCages()}
     </CustomInput>
     </Col>
   </FormGroup>
   <FormGroup check row>
     <Col sm={{ size: 10, offset: 1 }}>
      <Button  color="primary"><FontAwesomeIcon icon={Icons.faSearch}/>Rechercher</Button>
      {' '}<Link to={'/animals'}><Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
     </Col>
   </FormGroup>
   </Form>
   </div>
       </Container>
         
      </div>
      );
  }
}
export default  SearchAnimal;