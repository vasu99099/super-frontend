import SectionLoader from '@/components/common/SectionLoader';
import Timeline from '@/components/common/Timeline';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { ROUTE_PATH } from '@/constant/Routes';
import { TrashBinIcon } from '@/icons';
import { DeleteIcon } from '@/icons/components/DeleteIcon';
import EditIcon from '@/icons/components/EditIcon';
import { dispatch, useSelector } from '@/store';
import { DosageType, MarkDosageAsPurchased, deleteDosage } from '@/store/slices/dosageSlice';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React from 'react';

const TimelineItem = (event: DosageType, index: number) => {
  const router = useRouter();
  const markAsPurchased = async () => {
    await dispatch(MarkDosageAsPurchased(event.dosage_id, event.farm_id));
  };
  const handleDeleteDosage = async () => {
    await dispatch(deleteDosage(event.dosage_id, event.farm_id));
  };
  const handleEditDosage = async () => {
    router.push(
      ROUTE_PATH.ADMIN.DOSAGE_SUGGESTION.EDIT_DOSAGE_SUGGESTION(
        event.customer_id,
        event.dosage_id,
        event.farm_id
      )
    );
  };
  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 text-gray-500 dark:text-gray-400 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900 ">
        {index + 1}
      </span>

      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white flex gap-2 items-center">
        <span className="me-2">{moment(event.created_at).format('Do MMMM, YYYY')}</span>
        {index === 0 && !event.isClosed && (
          <span className=" ">
            <Badge>Latest</Badge>
          </span>
        )}
        <span
          className=" green-red-600 cursor-pointer"
          onClick={handleEditDosage}
          title="Edit Suggestions">
          <EditIcon />
        </span>
        <span
          className=" text-red-600 cursor-pointer"
          onClick={handleDeleteDosage}
          title="delete Suggestions">
          <DeleteIcon />
        </span>
        {!event.isClosed && (
          <span onClick={markAsPurchased} title="mark it as purchased">
            <Button className="!rounded-sm text-2xl !p-2 !py-1" variant="success" size="sm">
              mark as purchased
            </Button>
          </span>
        )}
      </h3>
      <ul className="list-disc ms-3">
        {event.suggestions?.map((s) => (
          <li
            className="text-base font-normal text-gray-500 dark:text-gray-400"
            key={s.suggested_id}>
            {s.product}
            {s.note ? `, ${s.note}` : ''}
          </li>
        ))}
      </ul>
    </li>
  );
};
const SuggestionList = ({ isClosed = false }) => {
  const { dosages, isLoading } = useSelector((state) => state.dosage);

  return (
    <div>
      <SectionLoader isLoading={isLoading}>
        <Timeline
          items={isClosed ? dosages?.closed ?? [] : dosages?.open ?? []}
          renderItem={TimelineItem}
        />
      </SectionLoader>
    </div>
  );
};

export default SuggestionList;
