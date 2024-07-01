export default function Page({ params }: { params: { id: string } }) {
    return <h1>Info Page {params.id}</h1>
}