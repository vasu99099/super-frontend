import { confirm } from '@/components/common/ConfirmBox';
import { DeleteIcon } from '@/icons/components/DeleteIcon';
import EditIcon from '@/icons/components/EditIcon';
import { FarmType, customerType } from '@/types/customerType';
import React, { useCallback } from 'react';

const FarmAccordionBody = ({
  col,
  handleEdit,
  handleDelete
}: {
  col?: customerType;
  handleEdit: (id: number, customer: customerType) => void;
  handleDelete: (id: number) => void;
}) => {
  const handleOnDelete = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    if (id && handleDelete) {
      const isConfirmed = await confirm('Are you sure you want to delete this item?');
      if (isConfirmed) {
        handleDelete(parseInt(id));
      }
    }
  }, []);
  const handleOnEdit = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const id = e.currentTarget.dataset.id;
      const row = e.currentTarget.dataset.val;

      if (id && row && col && handleEdit) {
        handleEdit(parseInt(id), { ...col, farms: [JSON.parse(row) as FarmType] });
      }
    },
    [col, handleEdit]
  );

  if (!col) {
    return null;
  }

  return (
    <div className="mx-5 my-5">
      <div className="shadow-sm overflow-hidden">
        {/* Table */}
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              <th className="text-left px-4 py-1 ">Farm Name</th>
              <th className="text-left px-4 py-1 ">Village</th>
              <th className="text-left px-4 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {col.farms.length ? (
              col.farms.map((farm, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {farm.farm_name ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {farm.village_name ?? '-'}
                  </td>
                  <td className="px-4 py-3 flex space-x-2 ">
                    <div
                      className="text-brand-500 cursor-pointer"
                      data-id={farm.farm_id}
                      data-val={JSON.stringify(farm)}
                      onClick={handleOnEdit}>
                      <EditIcon />
                    </div>
                    <div
                      className="text-red-600 cursor-pointer"
                      data-id={farm.farm_id}
                      onClick={handleOnDelete}>
                      <DeleteIcon />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3" colSpan={2}>
                  No Farm Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmAccordionBody;
