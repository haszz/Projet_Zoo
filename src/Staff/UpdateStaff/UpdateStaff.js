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


class UpdateStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff: [],
            isAdded: false,
            error: null
        ,staffId: this.props.match.params.staffId};
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
      this.getStaffInfo();
    }

    
    handleSubmit(event) {
      event.preventDefault()
      let formData = new FormData(event.target);
      const data = new URLSearchParams(formData);
      let u = 'http://localhost:3000/staffs/'+this.state.staffId;
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
    getStaffInfo() {
        let u = 'http://localhost:3000/staffs/'+this.state.staffId;
        console.log(u);
      fetch(u)
      .then(result=>result.json())
    .then(items=>this.setState({staff: items}))
    }

    render() {
      const { error, isAdded } = this.state;
      let message =  this.state.staff.map((item, i) => (
        <Jumbotron fluid >
        <Container fluid>
          <h6 className="display-4">{item.prenom}{' '}{item.nom}</h6>
          <p className="lead">Vous pouvez modifier les informations de "{item.prenom} {item.nom}" dans les champs suivants.</p>
        </Container>
      </Jumbotron>

      ));
      const staff = this.state.staff.map((item, i) => (
          <div>
        
        <Form key="updateForm" onSubmit={this.handleSubmit}>
        <FormGroup row>
          <Label for="nom" sm={2}>Nom</Label>
          <Col sm={10}>
            <Input defaultValue={item.nom} type="text" name="nom" id="nom" placeholder="Dupond" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="prenom" sm={2}>Prenom</Label>
          <Col sm={10}>
            <Input  defaultValue={item.prenom}  type="texte" name="prenom" id="prenom" placeholder="Thomas" required />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="salaire" sm={2}>Salaire (en €)</Label>
          <Col sm={10}>
            <Input defaultValue={item.salaire}  type="number" name="salaire" id="salaire" placeholder="1493" required />
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
            <Link to={'/staffs'}><Button outline color="primary"><FontAwesomeIcon icon={Icons.faHome}/> Voir la liste du personnel</Button>
            </Link> 
          </Col>
          );
        }
       
    
        return (
         <div>
   {message}
   <Container>
         {staff}
         
           
        </Container>
        </div>
        );
    }
}
export default  UpdateStaff;