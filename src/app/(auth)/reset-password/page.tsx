

export default function page() {
  return (
    <div>
    <p className="font-bold text-xl">Reset Password</p>
    {error && (
      <Chip
        color="danger"
        variant="light"
        classNames={{
          content: "p-0",
          closeButton: "text-black text-xl ms-5",
        }}
        onClose={() => setError("")}
      >
        {error}
      </Chip>
    )}
    <TTTForm
      onSubmit={handleResetPassword}
      resolver={zodResolver(resetPasswordValidation)}
    >
      <div className="space-y-2 max-w-xs">
        <TTTZPasswordInput
          name="password"
          label="Password"
          variant="underlined"
        />
        <TTTZPasswordInput
          name="confirmPassword"
          label="Confirm Password"
          variant="underlined"
        />

        <div className="mt-2">
          <Button type="submit" color="secondary" size="md">
            Submit
          </Button>
        </div>
      </div>
    </TTTForm>
  </div>
  )
}
