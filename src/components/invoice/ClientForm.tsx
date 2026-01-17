import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClientInfo } from '@/types/invoice';

interface ClientFormProps {
  client: ClientInfo;
  onChange: (client: ClientInfo) => void;
}

export function ClientForm({ client, onChange }: ClientFormProps) {
  const handleChange = (field: keyof ClientInfo, value: string) => {
    onChange({ ...client, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Client Information</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="client-name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Client Name
          </Label>
          <Input
            id="client-name"
            placeholder="John Doe"
            value={client.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="client-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email
          </Label>
          <Input
            id="client-email"
            type="email"
            placeholder="john@example.com"
            value={client.email}
            onChange={e => handleChange('email', e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="client-phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Phone
          </Label>
          <Input
            id="client-phone"
            type="tel"
            placeholder="+91 9876543210"
            value={client.phone}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="client-address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Address
        </Label>
        <Textarea
          id="client-address"
          placeholder="123 Main Street, City, State, PIN"
          value={client.address}
          onChange={e => handleChange('address', e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
