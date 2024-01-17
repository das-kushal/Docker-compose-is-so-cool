import { useEffect,useState } from 'react'

export default function App() {
  const [goal,setGoal] = useState({
    name: '',
    desc: ''
  })

  const [goals,setGoals] = useState([])

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/goals/')
      const data = await res.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals')
    }
  }

  useEffect(() => {
    fetchGoals()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5001/api/goals/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal)
      })

      if (res.ok) {
        console.log('Goal added successfully')
        fetchGoals()
      } else {
        console.error('Error adding goal')
      }
    } catch (error) {
      console.error('Error sending goal to backend')
    }
  }


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/goals/${id}`,{
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Goal deleted successfully');
        fetchGoals(); // Refresh the goals after deleting one
      } else {
        console.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:',error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/goals/${id}/complete`,{
        method: 'PATCH',
      });

      if (response.ok) {
        console.log('Goal marked as completed');
        fetchGoals(); // Refresh the goals after marking one as completed
      } else {
        console.error('Failed to mark goal as completed');
      }
    } catch (error) {
      console.error('Error marking goal as completed:',error);
    }
  };


  return (
    <>
      <h1>Add new goals to see them!!</h1>

      <div>
        <form>
          <input type="text" name="name" placeholder='Enter title of the goal' id="goal-name" value={goal.name} onChange={(e) => setGoal({ ...goal,name: e.target.value })} />
          <input type="text" name="desc" placeholder='Enter desc of the goal' id="goal-desc" value={goal.desc} onChange={(e) => setGoal({ ...goal,desc: e.target.value })} />
          <button type='submit' onClick={handleSubmit}>Save</button>
        </form>
      </div>

      <div>
        <h3>Goals are shown here: </h3>
        <ul>
          {goals.map((g) => (
            <li key={g._id}>
              {g.name} - {g.desc}{' '}
              <button onClick={() => handleDelete(g._id)}>Delete</button>
              <input type="checkbox" checked={g.isCompleted} onChange={() => handleComplete(g._id)} />
              {/* <button onClick={() => handleComplete(g._id)}>Mark as Completed</button> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
