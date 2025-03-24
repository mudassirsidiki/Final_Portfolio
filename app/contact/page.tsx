import Contact from "@/components/contact"

export const metadata = {
  title: "Contact | Mudassir Ahmed Siddiqui",
  description: "Get in touch with me for collaboration, job opportunities, or project inquiries",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Contact showFull={true} />
    </main>
  )
}

