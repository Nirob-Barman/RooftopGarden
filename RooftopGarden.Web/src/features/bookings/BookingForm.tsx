import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useGetServiceByIdQuery } from "../gardening-services/gardeningServicesApi";
import { useCreateBookingMutation } from "./bookingsApi";

const todayIso = () => new Date().toISOString().slice(0, 10);

const bookingSchema = z.object({
  bookingDate: z
    .string()
    .min(1, "Booking date is required")
    .refine((v) => v >= todayIso(), "Booking date cannot be in the past"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  address: z.string().min(1, "Address is required").max(500),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const inputClass =
  "w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-foreground/35";

export function BookingForm() {
  const [searchParams] = useSearchParams();
  const serviceId = Number(searchParams.get("serviceId"));
  const navigate = useNavigate();

  const { data: service, isLoading: isLoadingService } = useGetServiceByIdQuery(
    serviceId,
    {
      skip: !serviceId,
    },
  );

  const [createBooking, { isLoading: isCreating, error }] =
    useCreateBookingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  if (!serviceId) {
    return (
      <div className="mx-auto max-w-3xl p-6 sm:p-8">
        <div className="rounded-2xl border border-foreground/10 bg-surface p-10 text-center">
          <div className="text-4xl">🌱</div>
          <h2 className="mt-4 text-xl font-bold">Choose a gardening service</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Please select a service before making a booking.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Explore Services
          </Link>
        </div>
      </div>
    );
  }

  if (isLoadingService) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-6 p-6">
        <div className="h-8 w-64 rounded bg-foreground/10" />
        <div className="h-64 rounded-2xl bg-foreground/10" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-foreground/10 bg-surface p-10 text-center">
          <div className="text-4xl">🪴</div>
          <h2 className="mt-4 text-xl font-bold">Service not found</h2>
          <p className="mt-2 text-sm text-foreground/60">
            This service may have been removed or is unavailable.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const booking = await createBooking({
        serviceId,
        bookingDate: values.bookingDate,
        preferredTime: `${values.preferredTime}:00`,
        address: values.address,
        notes: values.notes || null,
      }).unwrap();

      navigate(`/bookings/${booking.id}`);
    } catch {
      // Error is displayed below.
    }
  };

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/services"
            className="mb-5 inline-flex items-center gap-2 text-sm text-foreground/55 transition hover:text-primary"
          >
            <span>←</span>
            Back to Services
          </Link>

          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            SERVICE BOOKING
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Book Your Gardening Service
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/60">
            Let's bring your rooftop garden to life. Choose your preferred
            schedule and provide your property details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {/* Booking Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Schedule */}
              <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                    📅
                  </div>
                  <div>
                    <h2 className="font-semibold">Choose Your Schedule</h2>
                    <p className="mt-1 text-xs text-foreground/50">
                      Select your preferred booking date and time.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="bookingDate"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Preferred Date
                    </label>
                    <input
                      id="bookingDate"
                      type="date"
                      min={todayIso()}
                      className={inputClass}
                      {...register("bookingDate")}
                    />
                    {errors.bookingDate && (
                      <p className="mt-2 text-xs font-medium text-error">
                        {errors.bookingDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="preferredTime"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Preferred Time
                    </label>
                    <input
                      id="preferredTime"
                      type="time"
                      className={inputClass}
                      {...register("preferredTime")}
                    />
                    {errors.preferredTime && (
                      <p className="mt-2 text-xs font-medium text-error">
                        {errors.preferredTime.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Property Details */}
              <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                    🏡
                  </div>
                  <div>
                    <h2 className="font-semibold">Property Information</h2>
                    <p className="mt-1 text-xs text-foreground/50">
                      Tell us where the gardening service is needed.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Rooftop / Property Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="Enter your full property address..."
                      className={`${inputClass} resize-y`}
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="mt-2 text-xs font-medium text-error">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Additional Notes
                      <span className="ml-2 font-normal text-foreground/40">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      placeholder="Any special instructions or requirements..."
                      className={`${inputClass} resize-y`}
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <p className="mt-2 text-xs font-medium text-error">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Service Summary */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-primary/5 text-5xl">
                    🌿
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    SELECTED SERVICE
                  </p>

                  <h2 className="mt-3 text-lg font-bold">{service.name}</h2>

                  {service.description && (
                    <p className="mt-2 text-sm leading-6 text-foreground/55">
                      {service.description}
                    </p>
                  )}

                  <div className="my-5 border-t border-foreground/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                      Service Price
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                      Estimated Duration
                    </span>
                    <span className="text-sm font-semibold">
                      {service.duration}
                    </span>
                  </div>
                </div>
              </section>

              <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
                <div className="flex items-center gap-2">
                  <span>🌱</span>
                  <h3 className="text-sm font-semibold">Growing Together</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-foreground/60">
                  Our gardening team will use your booking details to prepare
                  for your selected service.
                </p>
              </div>
            </aside>
          </div>

          {/* Submit Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/services"
              className="rounded-xl border border-foreground/15 px-7 py-3 text-center text-sm font-semibold transition hover:bg-foreground/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Creating Booking..." : "Confirm Booking →"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-error/20 bg-error/5 p-4 text-sm text-error">
              Could not create the booking. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
