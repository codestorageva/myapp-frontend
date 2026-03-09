'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Colors from '@/app/utils/colors'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import LoadingSymbol from '@/app/component/loading'
import { signIn, SignInResponse } from 'next-auth/react'
import { FaFacebookF, FaGoogle } from 'react-icons/fa6'

type LoginFormFields = {
  email: string
  password: string
}

const Login = () => {

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isRememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [formErrors, setFormErrors] = useState<Partial<LoginFormFields>>({})

  const [input, setInput] = useState<LoginFormFields>({
    email: '',
    password: '',
  })

  const onlyEmail = new RegExp(
    "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
  )

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(onlyEmail, { message: 'Please enter a valid email.' })
      .required('Email is required.'),
    password: Yup.string()
      .min(3, 'Password must be at least 3 characters.')
      .required('Password is required.'),
  })

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail') ?? ''
    const savedPassword = localStorage.getItem('savedPassword') ?? ''
    if (savedEmail && savedPassword) {
      setInput({ email: savedEmail, password: savedPassword })
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(undefined)
      setFormErrors({})

      await LoginSchema.validate(input, { abortEarly: false })

      const res: SignInResponse | undefined = await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirect: false,

      })
      console.log("Response =========> ", res)
      if (!res?.error) {
        if (isRememberMe) {
          localStorage.setItem('savedEmail', input.email)
          localStorage.setItem('savedPassword', input.password)
        } else {
          localStorage.removeItem('savedEmail')
          localStorage.removeItem('savedPassword')
        }
        router.replace('/')
        toast.success('Login successful!')
      } else {
        setError('Invalid credentials')
        toast.error('Authentication failed. Please try again.',
          {
            autoClose: 3000,
          })
      }
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const errors: Partial<LoginFormFields> = {}
        err.inner.forEach((validationError: Yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path as keyof LoginFormFields] = validationError.message
          }
        })
        setFormErrors(errors)
      } else {
        setError('Something went wrong.')
      }
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/images/background.png')" }}
    >
      {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div> */}

      <div className="relative bg-white backdrop-blur-md rounded-xl shadow-lg w-full max-w-xl p-10 z-10">
        <h1 className="text-2xl font-semibold text-black mb-7 font-inria">Sign In</h1>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-base" style={{ color: Colors.labelColor }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-300 dark:text-black"
            style={{
              border: `1px solid ${Colors.borderColor}`,
            }}
          />
          {formErrors.email && <span className="text-red-600 text-sm">{formErrors.email}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-base" style={{ color: Colors.labelColor }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-300 pr-10 dark:text-black"
              style={{
                border: `1px solid ${Colors.borderColor}`,
              }}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <Image
                src={showPassword ? '/assets/images/hide.svg' : '/assets/images/show.svg'}
                alt={showPassword ? 'Hide password' : 'Show password'}
                width={18}
                height={18}
              />
            </button>
          </div>
          {formErrors.password && <span className="text-red-600 text-sm">{formErrors.password}</span>}
        </div>

        {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-[#760000] to-[#AF0000] text-white py-2 rounded-lg mt-4`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSymbol /> : 'Login'}
        </button>

        <div className="flex justify-between items-center text-lg my-4">
          <label className="flex items-center text-base" style={{ color: Colors.labelColor }}>
            <input
              type="checkbox"
              className="mr-2"
              checked={isRememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className="text-[#AF0000] underline hover:underline text-base">
            Forgot Password?
          </a>
        </div>

        <div className="my-6 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="bg-white px-2 text-sm text-gray-500 relative">or</span>
        </div>

        <div className="space-y-3">
          <button className="w-full border flex items-center justify-center px-4 py-2 rounded-full relative">
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width={20}
              height={20}
              className="absolute left-4"
              alt="Google"
            />
            <span className="mx-auto dark:text-black text-base">Continue with Google</span>
          </button>
          <button className="w-full border flex items-center justify-center px-4 py-2 rounded-full relative">
            <Image
              src="/assets/images/fb.png"
              width={20}
              height={20}
              className="absolute left-4"
              alt="Facebook"
            />
            <span className="mx-auto dark:text-black text-base">Continue with Facebook</span>
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="#" className="text-[#AF0000] hover:underline font-bold">
            Sign up
          </a>
        </p>
      </div>
    </div>


  )
}

export default Login