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


class UpdateAnimal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateDeNaissance: null,
            dateEntreeZoo: null,
            animal: [],
            cages:[],
            isAdded: false,
            error: null,
            animalId: this.props.match.params.animalId};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
      this.getCageList();
      this.getAnimalInfo();
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

      var regexDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
      var dateDeNaissance = formData.get('dateDeNaissance');
           // First check for the pattern
           if(!regexDate.test(dateDeNaissance)){
            this.setState({ error: new Error("La date de naissance n'est pas valide.") })
            return;
          }
          var parts =dateDeNaissance.split('/');

      dateDeNaissance = new Date(parts[2] , parts[1] - 1, parts[0]); 
          
  

      
      var dateEntreeZoo=formData.get('dateEntreeZoo');
           // First check for the pattern
           if(!regexDate.test(dateEntreeZoo)){
            this.setState({ error: new Error("La date d'entree au zoo n'est pas valide.") })
            return;
          }
           parts =dateEntreeZoo.split('/');

      dateEntreeZoo = new Date(parts[2], parts[1] - 1, parts[0]); 
      if(dateEntreeZoo < dateDeNaissance){
        this.setState({ error: new Error("La date d’entrée au zoo ne peut pas précéder la date de naissance.") })
        return;
      }
      dateDeNaissance = moment(dateDeNaissance).format('YYYY-MM-DD');
      formData.set('dateDeNaissance', dateDeNaissance);
      dateEntreeZoo = moment(dateEntreeZoo).format('YYYY-MM-DD');
      formData.set('dateEntreeZoo', dateEntreeZoo);

           
          
      const data = new URLSearchParams(formData);
      
      let u = 'http://localhost:3000/animals/'+this.props.match.params.animalId;
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
    getAnimalInfo() {
        let u = 'http://localhost:3000/animals/'+this.state.animalId;
      fetch(u)
      .then(result=>result.json())
    .then(items=>this.setState({animal: items}))
    .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
    }
    getCages(id){
      var s = '';
      for (var i = 0; i < this.state.cages.length; i++) {
        if(this.state.cages[i].id === id){
          s += '<option value='+this.state.cages[i].id+'>'+this.state.cages[i].nom+'</option>';
        }
    }
    for (var i = 0; i < this.state.cages.length; i++) {
      if(this.state.cages[i].id !== id){
        s += '<option value=\''+this.state.cages[i].id+ '\' key=\''+this.state.cages[i].id+'\' \'>'+this.state.cages[i].nom+'</option>';
      }
  }
  return ReactHtmlParser(s);
    }
    render() {
      
let message = this.state.animal.map((item, i) => (    <div>
                    <Jumbotron fluid >
    <Container fluid>
      <h6 className="display-4">Modifier les informations de {item.nom}</h6>
    </Container>
  </Jumbotron>
</div>));
      console.log(this.props.location.state)
      const { error, isAdded } = this.state;
      const animal = this.state.animal.map((item, i) => (
          <div style={{marginBottom: 1 + 'em'}}>
     
        <Form key="updateForm" onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input defaultValue={item.nom} type="text" name="nom" id="nom" placeholder="George" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="race" sm={2}>Race</Label>
          <Col sm={10}>
            <Input  defaultValue={item.race}  type="texte" name="race" id="race" placeholder="Labrador" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="nourritureParJour" sm={2}>Nourriture par jour (en Kg)</Label>
          <Col sm={10}>
            <Input defaultValue={item.nourritureParJour}  type="number" name="nourritureParJour" id="nourritureParJour" placeholder="23" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="dateDeNaissance" sm={2}>Date de naissance</Label>
          <Col sm={10}>
            <Input  defaultValue={new Date(item.dateDeNaissance).toLocaleDateString()} type="text" name="dateDeNaissance" placeholder="jj/mm/aaaa" id="dateDeNaissance" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="dateEntreeZoo" sm={2}>Date d'entrée au zoo</Label>
          <Col sm={10}>
            <Input     defaultValue={new Date(item.dateEntreeZoo).toLocaleDateString()}  type="text" placeholder="jj/mm/aaaa" name="dateEntreeZoo" id="dateEntreeZoo" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="cage" sm={2}>Cage</Label>
          <Col sm={10}>
          <CustomInput type="select" id="idCage" name="idCage" >
          {this.getCages(item.idCage)}
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
            <Link to={'/animals'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faKiwiBird}/> Voir la liste des animeaux</Button>
            </Link> 
          </Col>
          );
        }
       
    
        return (
          <div>
 {message}
  <Container>
         {animal}
         </Container>
           
        </div>
        );
    }
}
export default  UpdateAnimal;