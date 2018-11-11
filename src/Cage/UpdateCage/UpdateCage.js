import React, {
    Component
} from 'react';

import { Link } from 'react-router-dom';

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
    Input,
 
    Container
} from 'reactstrap';


class UpdateCage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cage: [],
            isAdded: false,
            error: null,
            cageId: this.props.match.params.cageId};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
      this.getCageInfo();
    }

    
    handleSubmit(event) {
      event.preventDefault()
      let formData = new FormData(event.target);
      const data = new URLSearchParams(formData);
      let u = 'http://localhost:3000/cages/'+this.state.cageId;
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
    getCageInfo() {
        let u = 'http://localhost:3000/cages/'+this.state.cageId;
        console.log(u);
      fetch(u)
      .then(result=>result.json())
    .then(items=>this.setState({cage: items}))
    }

    render() {
      const { error, isAdded } = this.state;
      let message =  this.state.cage.map((item, i) => (
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">{item.nom}</h6>
          <p className="lead">Vous pouvez modifier les informations de la cage "{item.nom}" dans les champs suivants.</p>
        </Container>
      </Jumbotron>

      ));
      const cage = this.state.cage.map((item, i) => (
          <div>
        
        <Form key="updateForm" onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input defaultValue={item.nom} type="text" name="nom" id="nom" placeholder="George" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="description" sm={2}>Description</Label>
          <Col sm={10}>
            <Input  defaultValue={item.description}  type="texte" name="description" id="description" placeholder="Labrador" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="taille" sm={2}>Taille</Label>
          <Col sm={10}>
            <Input defaultValue={item.taille}  type="number" name="taille" id="taille" placeholder="23" required />
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
            <Link to={'/cages'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faHome}/> Voir la liste des cages</Button>
            </Link> 
          </Col>
          );
        }
       
    
        return (
         <div>
   {message}
   <Container>
         {cage}
         
           
        </Container>
        </div>
        );
    }
}
export default  UpdateCage;