import axios from "axios"

const baseURL = '/api/persons'

const add = (newPerson) => {
    const request = axios.post(baseURL, newPerson)

    return request.then(r => {
        console.log(r)
        return r.data
    }
    )
    //return request.then(r => r.data)
}

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(r => r.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(r => r.data)
}

const update = (id, updatedObj) => {
    const request = axios.put(`${baseURL}/${id}`, updatedObj)
    return request.then(r => r.data)
}


export default { add, getAll, deletePerson, update }