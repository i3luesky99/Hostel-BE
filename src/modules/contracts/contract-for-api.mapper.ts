import { Contract } from '../../entities/contract.entity';
import { ContractOccupant } from '../../entities/contract-occupant.entity';
import type { ProvisionedAccount } from './contracts.service';

function occupantForApi(o: ContractOccupant) {
  return { id: o.id, user: o.user };
}

export function contractForApi(c: Contract) {
  const { occupants, ...rest } = c;
  return {
    ...rest,
    occupants: occupants?.map(occupantForApi),
  };
}

export function createContractResponse(payload: {
  contract: Contract;
  provisionedAccounts: ProvisionedAccount[];
}) {
  return {
    contract: contractForApi(payload.contract),
    provisionedAccounts: payload.provisionedAccounts,
  };
}
