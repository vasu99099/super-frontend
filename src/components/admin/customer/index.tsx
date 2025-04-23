'use client';
import CustomTable from '@/components/tables/CustomTable';
import { useModal } from '@/hooks/useModal';
import { dispatch, useSelector } from '@/store';
import React, { useState } from 'react';
import Button from '@/components/ui/button/Button';
import { SortOrderType, TableColumn, tableConfigType } from '@/types/customTableType';
import { deleteCustomer, deleteFarm, getCustomers } from '@/store/slices/customerSlice';

import { useRouter } from 'next/navigation';
import { ROUTE_PATH } from '@/constant/Routes';
import { Modal } from '@/components/ui/modal';
import AddFarm from './AddFarm';
import { FarmType, customerType } from '@/types/customerType';
import FarmAccordionBody from './FarmAccordionBody';
import CustomDropdown from '@/components/ui/dropdown/CustomDorpdown';
import EyeIcon from '@/icons/components/EyeIcon';

const tableColumn: TableColumn[] = [
  { name: 'Customer Name', key: 'name', sortable: true },
  { name: 'Phone', key: 'phone' },
  { name: 'Whatsapp number', key: 'whatsapp_number' },
  { name: 'Email', key: 'email' },
  { name: 'Village', key: 'village.name', sortable: true },
  { name: 'Address', key: 'address', maxLength: 20 }
];
const tableConfig: tableConfigType = {
  idKey: 'customer_id',
  searchBar: true,
  searchBarPlaceholder: 'Search by customer name'
};

const Customer = () => {
  const { customers, totalCustomers, isLoading = true } = useSelector((state) => state.customer);
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentCustomer, setCurrentCustomer] = useState<customerType | undefined>();
  const [isFarmEdit, setFarmEdit] = useState<boolean>(false);

  const handleEdit = async (id: number | string) => {
    router.push(ROUTE_PATH.ADMIN.customer.EDIT_CUSTOMER(id));
  };

  const handleDelete = async (id: number | string) => {
    id = Number(id);
    await dispatch(deleteCustomer({ customer_id: id }));
  };
  const handleOnDeleteFarm = async (id: number) => {
    await dispatch(deleteFarm({ farm_id: id }));
  };

  const handleAddCategory = () => {
    router.push(ROUTE_PATH.ADMIN.customer.ADD_CUSTOMER);
  };
  const handleTableAction = async (
    page: number,
    order: SortOrderType,
    orderBy: string,
    rowsPerPage: number,
    searchText?: string,
    abortSignal?: AbortSignal
  ) => {
    await dispatch(getCustomers(page, order, orderBy, rowsPerPage, searchText, abortSignal));
  };

  const handleAddFarm = (row: customerType) => {
    if (row.customer_id) {
      setCurrentCustomer(row);
      openModal();
    }
  };
  const handleAddSuggestion = (row: customerType) => {
    if (row.customer_id) {
      router.push(ROUTE_PATH.ADMIN.DOSAGE_SUGGESTION.ADD_DOSAGE_SUGGESTION(row.customer_id));
    }
  };
  const handleViewCustomer = (row: customerType) => {
    if (row.customer_id) {
      router.push(ROUTE_PATH.ADMIN.customer.DETAIL(row.customer_id));
    }
  };
  const handleEditFarm = (id: number, row: customerType) => {
    if (row.customer_id) {
      setFarmEdit(true);
      setCurrentCustomer(row);
      openModal();
    }
  };

  return (
    <div>
      <CustomTable
        hasSr
        hasActions
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableData={customers}
        tableColumn={tableColumn}
        tableConfig={tableConfig}
        isLoading={isLoading}
        onTableAction={handleTableAction}
        totalRow={totalCustomers}
        accordionBody={
          <FarmAccordionBody handleEdit={handleEditFarm} handleDelete={handleOnDeleteFarm} />
        }
        actionButtons={[
          <Button size="sm" onClick={handleAddCategory} key="add_cat">
            + Add Customer
          </Button>
        ]}
        columnExtraBtn={(row) => (
          <>
            <Button
              size="sm"
              onClick={() => {
                handleViewCustomer(row as customerType);
              }}
              key="add_view"
              variant="transparent"
              className="cursor-pointer !p-0 border-0"
              /*  title="View Customer" */
            >
              <EyeIcon />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleAddSuggestion(row as customerType);
              }}
              key="add_sugg"
              className="!p-1 !px-2 border"
              variant="primary">
              + Suggestion
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleAddFarm(row as customerType);
              }}
              key="add_cat"
              className="!p-1 !px-2 border"
              variant="secondary">
              + Farm
            </Button>
          </>
        )}
      />
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <AddFarm closeModal={closeModal} customer={currentCustomer} isEdit={isFarmEdit} />
      </Modal>
    </div>
  );
};

export default Customer;
