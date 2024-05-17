import AddressCard from "@/app/components/AddressCard"

const deliveryBillingPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-medium">Delivery and Billing Details</h1>

      <div className="mt-6">
        <h2 className="text-2xl font-medium mb-4">Delivery Addresses</h2>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <AddressCard isDelivery isMain />
          <AddressCard isDelivery />
          <AddressCard isDelivery />
          <AddressCard isDelivery />
          <AddressCard isDelivery />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-medium mb-4">Billing Addresses</h2>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <AddressCard isMain />
          <AddressCard />
          <AddressCard />
          <AddressCard />
          <AddressCard />
        </div>
      </div>
    </div>
  )
}

export default deliveryBillingPage