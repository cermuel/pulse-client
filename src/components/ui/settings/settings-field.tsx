type SettingsFieldProps = {
  label: string;
  description: string;
  children: React.ReactNode;
};

export function SettingsField({
  label,
  description,
  children,
}: SettingsFieldProps) {
  return (
    <div>
      <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
      <p className="mt-1 text-sm text-[#666]">{description}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
