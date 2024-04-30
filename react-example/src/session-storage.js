import React, { useReducer } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const userFormReducer = (state, action) => {
  switch (action.type) {
    case 'SETDATA':
      const newData = { ...state, [action.payload.field]: action.payload.value };
      return newData;
    case 'REPLACE_ALL':
      // Save data to sessionStorage
      sessionStorage.setItem('formData', JSON.stringify(action.payload));
      return { ...action.payload };
    default:
      return state;
  }
}



const SesionStoragePage = () => {
  // Get data from sessionStorage when component is mounted
  const _data = sessionStorage.getItem('formData');
  // const [formData, dispatch] = useReducer(userFormReducer, JSON.parse(_data) || {});
  const [formData, dispatch] = useReducer(userFormReducer, {});


  const onFormChange = (e) => {
    const mapedData = {};
    for (let i = 0; i < e.target.form.length; i++) {
      mapedData[e.target.form[i].name] = e.target.form[i].value;
    }
    dispatch({ type: 'REPLACE_ALL', payload: mapedData });
    console.log(mapedData);
  }


  return (
    <Container>
      <Row>
        <Col>
          <h1>Session Storage</h1>
          <p>Session storage is a type of web storage that allows you to store data for the duration of a page session. This means that the data is stored until the browser tab is closed.</p>
          <p>Session storage is useful for storing data that you want to persist for the duration of a page session, such as user preferences or form data.</p>
          <p>Session storage is similar to local storage, but the data is only available for the duration of a page session, whereas local storage data is persistent across browser sessions.</p>
        </Col>
      </Row>
      <Row>
        <Form
          defaultValue={formData}
          value={formData}
          onChange={
            onFormChange
          }>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={formData['email']} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" value={formData['password']} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Row>

    </Container>
  )
}

export default SesionStoragePage;