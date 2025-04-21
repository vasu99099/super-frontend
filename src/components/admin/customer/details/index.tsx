'use client';
import Text from '@/components/common/Text';
import Timeline from '@/components/common/Timeline';
import Radio from '@/components/form/input/Radio';
import { dispatch, useSelector } from '@/store';
import { getCustomersById } from '@/store/slices/customerSlice';
import { getDosages } from '@/store/slices/dosageSlice';
import { FarmType } from '@/types/customerType';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SuggestionList from './SuggestionList';

const STATUS = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' }
];
const CustomerDetailsIndex = () => {
  const customer = useSelector((state) => state.customer.singleActionCus);

  const searchParams = useParams();
  const searchQuery = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<{
    farm: null | FarmType;
    status: string;
  }>({
    farm: null,
    status: 'false'
  });
  useEffect(() => {
    const customer_id = searchParams.customerId as string;
    (async () => {
      if (customer_id) {
        const result = await dispatch(getCustomersById(customer_id));
        if (result.data && result.data?.farms?.length) {
          const farm = searchQuery.get('farm');
          console.log('farm', farm);
          let selectedFarm = result.data?.farms?.[0];
          if (farm) {
            selectedFarm = result.data.farms.find((f: any) => f.farm_id === Number(farm));
          }
          handleFarmChange(selectedFarm);
        }
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (selectedFilters.farm && selectedFilters.farm.farm_id) {
      dispatch(getDosages(selectedFilters.farm.farm_id));
    }
  }, [selectedFilters.farm]);

  const sendWhatsAppMessage = (phone: string, message: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  const handleFarmChange = (farm: FarmType) => {
    setSelectedFilters((prev) => ({ ...prev, farm }));
  };
  const handleStatusChange = (status: string) => {
    setSelectedFilters((prev) => ({ ...prev, status }));
  };

  return (
    <div className="">
      {customer && (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Customers Details:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Text content="Name:" className="font-medium me-1" />
              <Text content={customer.name} />
            </div>
            <div>
              <Text content="Phone:" className="font-medium me-1" />
              <a href={`tel:+91${customer.phone}`}>
                <Text content={customer.phone} className="!text-brand-600" />
              </a>
            </div>
            <div>
              <Text content="Email:" className="font-medium me-1" />
              <Text content={customer.email} />
            </div>
            <div>
              <Text content="Whatsapp number: " className="font-medium me-1" />
              <Text
                content={customer.whatsapp_number}
                onClick={() => sendWhatsAppMessage(customer.whatsapp_number ?? '', 'vasu')}
              />
            </div>
            <div>
              <Text content="Address: " className="font-medium me-1" />
              <Text content={customer.address} />
            </div>
            <div>
              <Text content="Villages: " className="font-medium me-1" />
              <Text content={customer.village.name} />
            </div>
          </div>
          {customer.farms.length && (
            <div className="grid md:grid-cols-2">
              <div>
                <h3 className="my-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">
                  Farms:
                </h3>
                {customer.farms.map((f) => (
                  <div className="mb-3" key={f.farm_id}>
                    <Radio
                      id={f.farm_id + 'farm'}
                      name="farm"
                      className=""
                      value={f.farm_name}
                      checked={f.farm_id === selectedFilters?.farm?.farm_id}
                      onChange={() => {
                        handleFarmChange(f);
                      }}
                      label={`${f.farm_name} - ${f.village_name ?? ''}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <h3 className="my-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">
                  Purchase Status:
                </h3>
                {STATUS.map((f) => (
                  <div className="mb-3" key={f.label}>
                    <Radio
                      id={f.label}
                      name="status"
                      className=""
                      value={f.value}
                      checked={f.value === selectedFilters.status}
                      onChange={handleStatusChange}
                      label={f.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-5 lg:p-6">
        <SuggestionList isClosed={selectedFilters.status === 'true'} />
      </div>
    </div>
  );
};

export default CustomerDetailsIndex;
