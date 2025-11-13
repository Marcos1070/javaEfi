import { useEffect, useState, Fragment } from "react"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  const [alumnos, setAlumnos] = useState([])

  // Llamada a la API Flask
  useEffect(() => {
    fetch("http://127.0.0.1:5000/alumnos")
      .then((res) => res.json())
      .then((data) => setAlumnos(data))
      .catch((err) => console.error("Error al obtener alumnos:", err))
  }, [])

  return (
    <Fragment>
      <h2>Mi Home</h2>
      <Button onClick={() => navigate('/tarjeta')} label='Ir al formulario' />
      <Button onClick={() => navigate('/personas')} label='Ver total de personas' />

      <h3>Lista de alumnos desde la API</h3>
      <ul>
        {alumnos.map((a) => (
          <li key={a.id}>
            {a.nombre} — Nota: {a.nota} — Asistencia: {a.asistencia}% — {a.rendimiento}
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default Home

