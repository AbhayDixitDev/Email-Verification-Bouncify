

import { toast } from 'sonner';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';

import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  Box,
  Card,
  Button,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ConfirmDialog } from './confirm-dialog';
import { CreateFolderDialog } from './createfolder';
import { RenameFolderDialog } from './rename_folder-dailog';

const ITEMS = [
  { id: '12', label: 'Home' },
  { id: '18', label: 'Pabbly Connect' },
  { id: '1', label: 'Main Folder' },
  { id: '13', label: 'Pabbly Subscription Billing' },
  { id: '14', label: 'Pabbly Email Marketing' },
  { id: '17', label: 'Pabbly Form Builder' },
  { id: '15', label: 'Pabbly Hook' },
];

const ITEMS1 = [{ id: '16', label: 'Trash' }];

const truncateText = (text, limit = 26) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

const StyledTreeItem = styled((props) => {
  const { label, onTrashClick, onHomeClick, nodeId, ...rest } = props;
  const confirm = useBoolean();
  const popover = usePopover();
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const handleItemClick = (event) => {
    if (label.includes('Trash')) {
      event.preventDefault();
      onTrashClick?.();
    } else if (label.includes('Home')) {
      event.preventDefault();
      onHomeClick?.();
    }
  };

  const handleIconClick = (event) => {
    event.stopPropagation();
    popover.onOpen(event);
  };



  const handleRenameFolderClick = () => {
    setRenameDialogOpen(true);
    popover.onClose();
  };

  const handleCreateFolderClose = () => setCreateFolderOpen(false);
  const handleRenameFolderClose = () => setRenameDialogOpen(false);
  const navigate = useNavigate();
  const handleNavigateToTeamMembers = () => {
    navigate('settings/team-members');
  };




  const handleDelete = () => {
    confirm.onFalse();
 
    toast.success(`Folder deleted successfully.`, {
 
      style: {
        marginTop: '15px',
      },
    });
  };

  // const ListCount = id => Math.floor(Math.random() * 5) + 1;
  const ListCount = (id) => 0;

  return (
    <>
      <TreeItem
        {...rest}
        onClick={handleItemClick}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pr: 1,
              height: '24.78px',
            }}
          >
            <Typography
              component="div"
              fontSize={14}
              fontWeight={500}
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Tooltip title={`Folder Name: ${label}`} placement="top" arrow>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {truncateText(label)}
                </span>
              </Tooltip> */}
              <Tooltip
                title={
                  label.includes('Trash')
                    ? 'Deleted email list can be restored or permanently deleted from the trash folder.'
                    : `Folder Name: ${label}`
                }
                placement="top"
                arrow
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {truncateText(label)}
                </span>
              </Tooltip>
              <Tooltip
                title="Number of lists in this folder"
                disableInteractive
                arrow
                placement="top"
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 14,
                    color: 'text.secondary',
                    flexShrink: 0,
                    ml: 1,
                  }}
                >
                  ({ListCount(nodeId)})
                </Typography>
              </Tooltip>
            </Typography>

            {!label.includes('Home') && !label.includes('Trash') && (
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Click to see options." disableInteractive arrow placement="top">
                  <IconButton
                    onClick={handleIconClick}
                    size="small"
                    sx={{
                      padding: 0.5,
                      '&:hover': { backgroundColor: 'action.hover' },
                      height: '24.78px',
                    }}
                  >
                    <Iconify icon="eva:more-vertical-fill" width={16} height={16} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              anchorEl={popover.anchorEl}
            >
              <MenuList>
                <Tooltip title="Change the folder's name." arrow placement="left">
                  <MenuItem onClick={handleRenameFolderClick}>
                    <Iconify icon="fluent:rename-16-filled" />
                    Rename
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  title="Click here to share the folder with team member , this will open the team member settings page"
                  arrow
                  placement="left"
                >
                  <MenuItem onClick={handleNavigateToTeamMembers}>
                    <Iconify icon="jam:share-alt-f" />
                    Share
                  </MenuItem>
                </Tooltip>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Tooltip title="Click to delete folder." arrow placement="left">
                  <MenuItem
                    onClick={() => {
                      confirm.onTrue();
                      popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </CustomPopover>
          </Box>
        }
      />
      <CreateFolderDialog open={createFolderOpen} onClose={handleCreateFolderClose} />
      <RenameFolderDialog open={renameDialogOpen} onClose={handleRenameFolderClose} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Do you really want to delete the folder?"
        content="Note that when a folder is deleted its email lists are moved to the home folder."
        action={
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        }
      />
      
    </>
  );
})(({ theme }) => ({
  color: theme.palette.grey[800],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.8, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '14px',
      fontWeight: 500,
      width: '100%',
      '& > svg': {
        marginRight: theme.spacing(1),
      },
    },
  },
}));

const CustomStyling = ({ onTrashClick, onHomeClick }) => (
  <>
    <RichTreeView
      aria-label="customized"
      items={ITEMS}
      sx={{ overflowX: 'hidden', width: 1 }}
      slots={{
        item: (props) => (
          <StyledTreeItem {...props} onTrashClick={onTrashClick} onHomeClick={onHomeClick} />
        ),
      }}
    />
    <Divider sx={{ borderStyle: 'dashed', my: 1, mt: 2 }} />
    <RichTreeView
      aria-label="customized"
      items={ITEMS1}
      sx={{ overflowX: 'hidden', width: 1 }}
      slots={{
        item: (props) => (
          <StyledTreeItem {...props} onTrashClick={onTrashClick} onHomeClick={onHomeClick} />
        ),
      }}
    />
  </>
);

const FolderSection = memo(({ onTrashClick, onHomeClick }) => {
  const createFolder = useBoolean();

  return (
    <Card sx={{ pl: 3, pr: 3, pt: 3, pb: 3 }}>
      <Typography variant="h6">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip
            disableInteractive
            title={
              <div style={{ textAlign: 'center' }}>
                You can create folders and manage connections within them.
              </div>
            }
            arrow
            placement="top"
          >
            <span>Folders</span>
          </Tooltip>

          <Tooltip title="Create a new folder." disableInteractive arrow placement="top">
            <Button
              sx={{
                mr: 1,
                mb: 1,
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 0,
              }}
              onClick={createFolder.onTrue}
              color="primary"
              variant="contained"
            >
              <Iconify icon="fa6-solid:plus" />
            </Button>
          </Tooltip>
        </Box>
      </Typography>
      <Divider sx={{ borderStyle: 'dashed', mb: 2, mt: 1 }} />
      <CustomStyling onTrashClick={onTrashClick} onHomeClick={onHomeClick} />
      <CreateFolderDialog open={createFolder.value} onClose={createFolder.onFalse} />
    </Card>
  );
});

FolderSection.displayName = 'FolderSection';

export { FolderSection };
