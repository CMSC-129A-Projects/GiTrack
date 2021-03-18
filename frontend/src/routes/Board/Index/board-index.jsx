/** @jsxImportSource @emotion/react */

import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

export default function BoardIndex() {
  return (
    <div>
      <div>
        <p>Board Name</p>
        <h2>CovCheck</h2>
      </div>
      <div>
        <Column title="Not Started" count={2} />
        <Column title="In Progress" count={2} />
        <Column title="Merged" count={2} />
      </div>
      <Button variant={buttonVariants.XLARGE.PRIMARY} icon="add">
        Create Task
      </Button>
    </div>
  );
}
