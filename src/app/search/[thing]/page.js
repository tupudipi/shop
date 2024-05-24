
const page = ( {params} ) => {
  const thing = params.thing;
  return (
    <div>{thing}</div>
  )
}

export default page