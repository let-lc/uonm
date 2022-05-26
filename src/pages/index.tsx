import { CwdSelect, OutdatedButton, PmSelect, Table, TerminalOutput, UpdateButton } from '@/components';

const Home = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-tk-night px-2 py-3 font-mono text-tk-text selection:bg-tk-purple selection:text-tk-storm">
      <CwdSelect />
      <hr className="my-3 border-tk-storm" />
      <div className="flex w-full justify-between">
        <PmSelect />
        <div className="flex gap-x-2">
          <OutdatedButton />
          <UpdateButton />
        </div>
      </div>
      <div className="relative flex flex-grow flex-col">
        <div className="relative my-2 flex-grow">
          <Table />
        </div>
        <TerminalOutput />
      </div>
    </div>
  );
};

export default Home;
