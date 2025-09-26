import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateRequestPayload } from '../api/requests';
import type { TravelerDetail } from '../types';
import { formatCurrency } from '../utils/format';

interface RequestFormProps {
  onSubmit: (payload: CreateRequestPayload) => Promise<void> | void;
  loading?: boolean;
}

const emptyTraveler = (): TravelerDetail => ({
  name: '',
  numberOfDays: 0,
  perDiemRate: 0,
  total: 0,
});

const RequestForm = ({ onSubmit, loading }: RequestFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [purposeOfTravel, setPurposeOfTravel] = useState('');
  const [travelStartDate, setTravelStartDate] = useState('');
  const [travelEndDate, setTravelEndDate] = useState('');
  const [modeOfTravel, setModeOfTravel] = useState('');
  const [vehicleRequired, setVehicleRequired] = useState(false);
  const [accommodationRequired, setAccommodationRequired] = useState(true);
  const [otherRequirements, setOtherRequirements] = useState('');
  const [programFee, setProgramFee] = useState<string>('');
  const [travelers, setTravelers] = useState<TravelerDetail[]>([emptyTraveler()]);

  const handleTravelerChange = (index: number, key: keyof TravelerDetail, value: string) => {
    setTravelers((current) => {
      const copy = [...current];
      const traveler = { ...copy[index] };
      if (key === 'name') {
        traveler.name = value;
      } else {
        const numeric = Number(value) || 0;
        if (key === 'numberOfDays') {
          traveler.numberOfDays = numeric;
        }
        if (key === 'perDiemRate') {
          traveler.perDiemRate = numeric;
        }
        if (key === 'total') {
          traveler.total = numeric;
        } else {
          traveler.total = Number((traveler.numberOfDays * traveler.perDiemRate).toFixed(2));
        }
      }
      copy[index] = traveler;
      return copy;
    });
  };

  const addTraveler = () => setTravelers((current) => [...current, emptyTraveler()]);
  const removeTraveler = (index: number) =>
    setTravelers((current) => current.filter((_, idx) => idx !== index));

  const validate = (): string | null => {
    if (!description.trim()) return 'A description is required.';
    if (!destination.trim()) return 'Destination is required.';
    if (!purposeOfTravel.trim()) return 'Purpose of travel is required.';
    if (!modeOfTravel.trim()) return 'Mode of travel is required.';
    if (!travelStartDate || !travelEndDate) return 'Travel dates are required.';
    const start = new Date(travelStartDate);
    const end = new Date(travelEndDate);
    if (end < start) return 'End date cannot be before start date.';
    if (!travelers.length || travelers.some((traveler) => !traveler.name.trim())) {
      return 'Each traveler must have a name.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);

    const payload: CreateRequestPayload = {
      description: description.trim(),
      destination: destination.trim(),
      purposeOfTravel: purposeOfTravel.trim(),
      travelStartDate,
      travelEndDate,
      modeOfTravel: modeOfTravel.trim(),
      travelers: travelers.map((traveler) => ({
        name: traveler.name.trim(),
        numberOfDays: traveler.numberOfDays,
        perDiemRate: traveler.perDiemRate,
        total: traveler.total,
      })),
      vehicleRequired,
      accommodationRequired,
      otherRequirements: otherRequirements.trim() || undefined,
      programFee: programFee ? Number(programFee) : undefined,
    };

    await onSubmit(payload);
  };

  const totalAllowance = travelers.reduce((sum, traveler) => sum + traveler.total, 0);

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <section className="form-grid">
        <label>
          Description
          <input value={description} onChange={(event) => setDescription(event.target.value)} required />
        </label>
        <label>
          Destination
          <input value={destination} onChange={(event) => setDestination(event.target.value)} required />
        </label>
        <label>
          Purpose of Travel
          <input value={purposeOfTravel} onChange={(event) => setPurposeOfTravel(event.target.value)} required />
        </label>
        <label>
          Mode of Travel
          <input value={modeOfTravel} onChange={(event) => setModeOfTravel(event.target.value)} required />
        </label>
        <label>
          Travel Start Date
          <input type="date" value={travelStartDate} onChange={(event) => setTravelStartDate(event.target.value)} required />
        </label>
        <label>
          Travel End Date
          <input type="date" value={travelEndDate} onChange={(event) => setTravelEndDate(event.target.value)} required />
        </label>
      </section>

      <section>
        <h2>Traveler Details</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number of Days</th>
                <th>Per Diem Rate (USD)</th>
                <th>Total (USD)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((traveler, index) => (
                <tr key={index}>
                  <td>
                    <input
                      value={traveler.name}
                      onChange={(event) => handleTravelerChange(index, 'name', event.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={traveler.numberOfDays}
                      onChange={(event) => handleTravelerChange(index, 'numberOfDays', event.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={traveler.perDiemRate}
                      onChange={(event) => handleTravelerChange(index, 'perDiemRate', event.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={traveler.total}
                      onChange={(event) => handleTravelerChange(index, 'total', event.target.value)}
                      required
                    />
                  </td>
                  <td>
                    {travelers.length > 1 && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => removeTraveler(index)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-actions">
          <button type="button" className="secondary" onClick={addTraveler}>
            Add Traveler
          </button>
          <span className="muted">Total Allowance: {formatCurrency(totalAllowance)}</span>
        </div>
      </section>

      <section className="form-grid">
        <label>
          Vehicle Required
          <select
            value={vehicleRequired ? 'YES' : 'NO'}
            onChange={(event) => setVehicleRequired(event.target.value === 'YES')}
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </label>
        <label>
          Accommodation Required
          <select
            value={accommodationRequired ? 'YES' : 'NO'}
            onChange={(event) => setAccommodationRequired(event.target.value === 'YES')}
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </label>
        <label>
          Other Requirements
          <input value={otherRequirements} onChange={(event) => setOtherRequirements(event.target.value)} />
        </label>
        <label>
          Program Fee (USD)
          <input
            type="number"
            min={0}
            value={programFee}
            onChange={(event) => setProgramFee(event.target.value)}
          />
        </label>
      </section>

      {formError && <p className="error-text">{formError}</p>}

      <div className="form-actions">
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
