export default function Page({ params }: { params: { id: string } }) {
    return <h1>View Page {params.id}</h1>
}