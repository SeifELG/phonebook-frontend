import { useState, useEffect } from 'react'
import axios from 'axios'
import peopleService from './services/people'

const Filter = ({ searchInput, handleSearchInput }) => {
  return <div>filter shown with <input value={searchInput} onChange={handleSearchInput} /></div>
}

const PersonForm = ({ newName, handleNameInput, newNumber, handleNumberInput, handleSubmit }) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameInput} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberInput} />
      </div>
      <div>
        <button type="submit" onClick={handleSubmit}>add</button>
      </div>
    </form>
  )
}

const SinglePerson = ({ person, deleteNote }) => {
  return <p>{person.name} {person.number} <button onClick={deleteNote}>delete</button></p>
}

const Persons = ({ persons, searchInput, deleteNote }) => {
  return persons
    .filter(person => person.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1)
    .map(person => <SinglePerson key={person.name} person={person} deleteNote={() => deleteNote(person.id)} />)
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    peopleService.getAll().then(persons => setPersons(persons))
  }, [])

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    if (persons.map(p => p.name).includes(newPerson.name)) {
      //return alert(newPerson.name + ' is already added to the phonebook')
      if (window.confirm('replace old number with new one?')) {
        const id = persons.find(person => person.name === newPerson.name).id
        peopleService
          .update(id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === id ? returnedPerson : p))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessage(error.response.data.error)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            
            // setMessage(`${newPerson.name} has already been deleted`)
            // setTimeout(() => {
            //   setMessage(null)
            // }, 5000)
            // setPersons(persons.filter(p => p.id !== id))
          })
      }
      return
    }

    peopleService
      .add(newPerson)
      .then(person => {
        setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })

  }

  const deleteNote = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name} from phonebook?`)) {
      peopleService
        .deletePerson(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
    }
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    return (
      <div className='message'>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Filter searchInput={searchInput} handleSearchInput={handleSearchInput} />
      <h2>add new</h2>
      <PersonForm newName={newName} handleNameInput={handleNameInput} newNumber={newNumber} handleNumberInput={handleNumberInput} handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <Persons persons={persons} searchInput={searchInput} deleteNote={deleteNote} />
    </div>
  )
}

export default App