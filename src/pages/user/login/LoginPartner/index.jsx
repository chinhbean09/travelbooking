import "./LoginPartner.scss";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Link } from "react-router-dom";
import { useLoginMutation } from "../../../../services/accountApi";

const schema = yup
    .object({
        emailOrPhone: yup.string().required("This is required field.").trim(),
        password: yup.string().required("This is required field.").trim(),
    })
    .required()

function LoginPartner() {
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (dataObj) => {
        try {
            const result = await login({
                phone_number: dataObj.emailOrPhone,
                password: dataObj.password,
                role_id: 2
            }).unwrap();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="wrapper-login-partner">
            <h1 className="title">Login for partner</h1>
            <div className="container">
                <form
                    className="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="body">
                        {/* Email */}
                        <div className="item">
                            <p className="label">Email or Phone number</p>
                            <input
                                {...register("email")}
                                className="input"
                                autoComplete="off"
                                placeholder="Enter email or phone number"
                            />
                            <p className="error">{errors.emailOrPhone?.message}</p>
                        </div>
                        {/* Password */}
                        <div className="item">
                            <p className="label">Password</p>
                            <input
                                {...register("password")}
                                className="input"
                                type="password"
                                autoComplete="off"
                                placeholder="Enter password"
                            />
                            <p className="error">{errors.password?.message}</p>
                        </div>
                    </div>
                    <button className="btn">
                        {isLoading ? "Logging in..." : "Login"}

                    </button>
                </form>
                <div className="register-section">
                    <h3 className="login-content-ask">
                        Want to become a partner?
                    </h3>
                    <p className="login-content-signup">
                        <Link to={`/register/partner`}>Register as a partner</Link>
                    </p>
                </div>
            </div>
            <div className="other-type-login">
                <h3 className="sub-title">Or</h3>
                <div className="link-group">
                    <Link className="link" to={"/login/member"}>Login for member</Link>
                    <Link className="link" to={"/login/admin"}>Login for admin</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPartner;