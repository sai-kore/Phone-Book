import { useState, useEffect } from "react";
import numberService from "./services/numbers";
import Notification from "./components/Notificaton";

const Filter = ({ filtername, handleFilteredChange }) => {
  return (
    <div>
      Filter :
      <input value={filtername} onChange={handleFilteredChange} />
    </div>
  );
};

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        Name :
        <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        Number :
        <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

const Persons = ({ filtered, deleteNumber }) => {
  return (
    <div>
      {filtered.map((person) => (
        <div className="person-row" key={person.id}>
          <p className="contact-info">
            <span className="name">{person.name}</span>
            <span className="number">{person.number}</span>
          </p>

          <button onClick={() => deleteNumber(person.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filtername, setFiltername] = useState("");
  const [personAdded, setpersonAdded] = useState("");

  useEffect(() => {
    numberService.getAll().then((response) => setPersons(response));
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`,
      );

      if (confirmReplace) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber,
        };

        numberService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson,
              ),
            );
          });

        setNewName("");
        setNewNumber("");
      }

      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    numberService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        setpersonAdded(`Added ${response.name}`);

        setTimeout(() => {
          setpersonAdded(null);
        }, 3000);

        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteNumber = (id) => {
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      numberService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilteredChange = (event) => {
    setFiltername(event.target.value);
  };

  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(filtername.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={personAdded} />
      <Filter
        filtername={filtername}
        handleFilteredChange={handleFilteredChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons filtered={filtered} deleteNumber={deleteNumber} />
    </div>
  );
};

export default App;
