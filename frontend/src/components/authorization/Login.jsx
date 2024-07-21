import { useEffect, useState } from "react"
import {Button, Form}  from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import {toast} from "react-toastify"
import {authUser} from "../../services/userService"
const Login = () => {
    const [email, setEmail] = useState("")    
    const [password, setPassword] = useState("")    
    const navigate = useNavigate()

    const submitHandler = async(e)=>{
        e.preventDefault()

        if(!email && !password){
            toast.error("Please fill all the fields!")
            return
        }
        try {
            
        
               const { data } = await authUser( email, password)         
                toast.success('Login successfully!')
                console.log(data.data)
                localStorage.setItem('userInfo',JSON.stringify(data))
                navigate('/chats')
            
        } catch (error) {
            toast.error("Error occured!")
        }
    }

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('userInfo'))
        console.log(user)

        if(user){
            navigate('/chats')
        }
    },[navigate])


    return(
        <div className="login-container">
        <div className="login-form">
            <h2>Login</h2>
            <Form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <Form.Text></Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <Form.Text></Form.Text>
                </Form.Group>

                <Button 
                variant="dark"
                onClick={submitHandler}
                >Login</Button>
            </Form>
        </div>
        </div>
    )
}

export default Login