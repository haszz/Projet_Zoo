import React, {
    Component
  } from 'react';
  import ReactHtmlParser from 'react-html-parser';

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import * as Icons from "@fortawesome/fontawesome-free-solid"
  import { Link } from 'react-router-dom';
  import {
  CustomInput,
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
  
  
  class SearchFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animals:[]};
        this.handleSubmit = this.handleSubmit.bind(this);  
    }

    componentDidMount() {
        this.getAnimalList();
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
      let nom=formData.get('nom');
      let quantiteNourriture=formData.get('quantiteNourriture');
      let idAnimal=formData.get('idAnimal');
      let url = "";
        if(nom != ''){
          if(url.length >0){
            url += "&nom="+nom
          }else{
            url += "nom="+nom
          }
        }
        if(quantiteNourriture != ''){
          if(url.length >0){
          url += "&quantiteNourriture="+quantiteNourriture
          }else{
            url += "quantiteNourriture="+quantiteNourriture
          }
        }
        if(idAnimal != ''){
          if(url.length >0){
          url += "&idAnimal="+idAnimal
          }else{
            url += "idAnimal="+idAnimal
          }
        }
        if(url !== ""){
        this.props.history.push('/foods/search/'+url)
        }
      console.log(url);
  
    } 
    getAnimals(){
        var s = '';
    
            s += '<option value=""></option>';
        
      
      for (var i = 0; i < this.state.animals.length; i++) {
     
          s += '<option value=\''+this.state.animals[i].id+ '\' key=\''+this.state.animals[i].id+'\' \'>'+this.state.animals[i].nom+'</option>';
        
    }
    return ReactHtmlParser(s);
      }
  
    render() {

        return (
    <div>
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">Recherche nourritures</h6>
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
            <Input value={this.state.value} type="text" name="nom" id="nom" placeholder="George"  />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="quantiteNourriture" sm={2}>Quantite (en Kg)</Label>
          <Col sm={10}>
            <Input value={this.state.value} onChange={this.handleChange} type="number" name="quantiteNourriture" id="quantiteNourriture"  placeholder="23"  />
          </Col>
        </FormGroup>
        <FormGroup row>
     <Label for="Animal" sm={2}>Animal</Label>
     <Col sm={10}>
     <CustomInput type="select" id="idAnimal" name="idAnimal" >
     {this.getAnimals()}
     </CustomInput>
     </Col>
   </FormGroup>
        <FormGroup  row>
          <Col sm={{ size: 10 }} >
          <Button  color="primary"><FontAwesomeIcon icon={Icons.faSearch}/> Rechercher</Button>{' '}
          <Link to={{ pathname: '/foods', state: { from: '/searchFood'} }}> <Button outline color="danger"><FontAwesomeIcon icon={Icons.faTimesCircle}/> Annuler</Button></Link>
  
  
        
           
          </Col>
        </FormGroup>
        
      </Form>
      </Container>
      </div>
        );
    }
  }
  export default  SearchFood;