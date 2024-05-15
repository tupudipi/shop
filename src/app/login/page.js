import Link from "next/link";

const loginPage = () => {
    return (
        <div className='container mx-auto flex flex-col gap-4 my-12'>
            <div className='border rounded-2xl p-8 mx-auto w-full max-w-96 bg-white shadow'>
                <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>Login</h1>
                <form className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='username' className="text-gray-800 text-sm">Username</label>
                        <input type='text' id='username' name='username'
                            className='border rounded h-8' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='password' className="text-gray-800 text-sm">Password</label>
                        <input type='password' id='password' name='password'
                            className='border rounded h-8' />
                    </div>
                    <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'>
                        Login
                    </button>
                </form>
                <div className='relative flex items-center justify-center'>
                    <hr className='border-2 rounded-full my-4 absolute w-full'></hr>
                    <p className='bg-white p-6 z-10 text-gray-500 font-semibold'>OR</p>
                </div>
                <div className='w-full flex justify-center'>
                    <button className='text-blue-700 font-bold py-2 hover:text-blue-900 px-4 rounded w-2/3'>
                        Login with Google
                    </button>
                </div>
                <Link href="/forgot-password" className="flex justify-center py-2">
                    <p className='text-blue-500 hover:underline hover:text-blue-700 text-sm'>Forgot Password?</p>
                </Link>


            </div>
            <div className='border rounded-2xl p-4 mx-auto w-full max-w-96 text-gray-800 text-center bg-white'>
                <p>Don&apos;t have an account? <Link href='/register' className='text-blue-500 hover:underline hover:text-blue-700'>Register</Link></p>

            </div>
        </div>
    )
}

export default loginPage;