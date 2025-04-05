
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";

type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
};

interface EmergencyContactsListProps {
  contacts: EmergencyContact[];
  addContact: (contact: EmergencyContact) => void;
  removeContact: (index: number) => void;
}

const EmergencyContactsList: React.FC<EmergencyContactsListProps> = ({ 
  contacts,
  addContact,
  removeContact
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: ""
    }
  });

  const onSubmit = (values: any) => {
    addContact(values);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <Label>Emergency Contacts</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input id="relationship" {...form.register("relationship", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form.register("phone", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" {...form.register("email")} />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No emergency contacts added yet.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact, index) => (
            <div key={index} className="border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{contact.name} ({contact.relationship})</h4>
                  <p className="text-sm text-gray-600">📞 {contact.phone}</p>
                  {contact.email && <p className="text-sm text-gray-600">✉️ {contact.email}</p>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeContact(index)}
                  className="text-red-500 h-8 w-8 p-0"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsList;
