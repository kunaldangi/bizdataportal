export default function Page({ params }: { params: { id: string } }) {
    return <h1>Users Page {params.id}</h1>
}