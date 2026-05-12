/**
 * VettCode Design System - Usage Examples
 * Copy these examples to quickly build professional UIs
 */

import React from 'react'
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  GridContainer,
  StyledCard,
  StatCard,
  PrimaryButton,
  SecondaryButton,
  StyledInput,
  SearchInput,
  StatusBadge,
  FlexRow,
  FlexColumn,
  Spacer,
  SectionTitle,
  SectionDivider,
  Label,
  HelperText,
  EmptyState,
} from './components'
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
} from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'

// ============================================================================
// EXAMPLE 1: Dashboard with Stats
// ============================================================================

export const DashboardExample = () => {
  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <FlexRow>
          <div>
            <PageTitle>Dashboard</PageTitle>
            <PageSubtitle>Welcome back! Here's what's happening today.</PageSubtitle>
          </div>
          <Spacer />
          <PrimaryButton startIcon={<Plus />}>
            Create New
          </PrimaryButton>
        </FlexRow>
      </PageHeader>

      {/* Stats Grid */}
      <GridContainer>
        <StatCard>
          <FlexRow>
            <TrendingUp sx={{ color: '#10B981', fontSize: 32 }} />
            <Spacer />
            <StatusBadge status="active">+12%</StatusBadge>
          </FlexRow>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
            $45,231
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Total Revenue
          </p>
        </StatCard>

        <StatCard>
          <FlexRow>
            <ShoppingCart sx={{ color: '#4F46E5', fontSize: 32 }} />
            <Spacer />
            <StatusBadge status="pending">+5</StatusBadge>
          </FlexRow>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
            1,234
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Total Orders
          </p>
        </StatCard>

        <StatCard>
          <FlexRow>
            <Users sx={{ color: '#F59E0B', fontSize: 32 }} />
            <Spacer />
            <StatusBadge status="active">+23</StatusBadge>
          </FlexRow>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
            8,549
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Active Users
          </p>
        </StatCard>

        <StatCard>
          <FlexRow>
            <DollarSign sx={{ color: '#EF4444', fontSize: 32 }} />
            <Spacer />
            <StatusBadge status="error">-3%</StatusBadge>
          </FlexRow>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
            $12,345
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Pending Payouts
          </p>
        </StatCard>
      </GridContainer>

      <SectionDivider />

      {/* Recent Activity Card */}
      <StyledCard>
        <SectionTitle>Recent Activity</SectionTitle>
        {/* Activity content here */}
      </StyledCard>
    </PageContainer>
  )
}

// ============================================================================
// EXAMPLE 2: Data Table with Filters
// ============================================================================

export const DataTableExample = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Applications</PageTitle>
        <PageSubtitle>Manage your application listings</PageSubtitle>
      </PageHeader>

      {/* Toolbar */}
      <StyledCard>
        <FlexRow>
          <SearchInput
            placeholder="Search applications..."
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ color: '#94A3B8', mr: 1 }} />,
            }}
            sx={{ width: 300 }}
          />
          <Spacer />
          <SecondaryButton startIcon={<Filter />}>
            Filter
          </SecondaryButton>
          <SecondaryButton startIcon={<Download />}>
            Export
          </SecondaryButton>
          <PrimaryButton startIcon={<Plus />}>
            Add Application
          </PrimaryButton>
        </FlexRow>
      </StyledCard>

      {/* Table Card */}
      <StyledCard sx={{ mt: 3 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Name
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Price
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Sales
              </th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                E-commerce Platform
              </td>
              <td style={{ padding: '16px' }}>
                <StatusBadge status="active">Active</StatusBadge>
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                $299
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                1,234
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <MoreVertical fontSize="small" />
                </IconButton>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                CRM System
              </td>
              <td style={{ padding: '16px' }}>
                <StatusBadge status="pending">Pending</StatusBadge>
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                $499
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                856
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <IconButton size="small">
                  <MoreVertical fontSize="small" />
                </IconButton>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                Analytics Dashboard
              </td>
              <td style={{ padding: '16px' }}>
                <StatusBadge status="draft">Draft</StatusBadge>
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                $199
              </td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
                423
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <IconButton size="small">
                  <MoreVertical fontSize="small" />
                </IconButton>
              </td>
            </tr>
          </tbody>
        </table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Edit</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Duplicate</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#EF4444' }}>
            Delete
          </MenuItem>
        </Menu>
      </StyledCard>
    </PageContainer>
  )
}

// ============================================================================
// EXAMPLE 3: Form with Validation
// ============================================================================

export const FormExample = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Create Application</PageTitle>
        <PageSubtitle>Add a new application to your store</PageSubtitle>
      </PageHeader>

      <StyledCard sx={{ maxWidth: 800 }}>
        <form>
          <FlexColumn>
            {/* Application Name */}
            <div>
              <Label htmlFor="app-name">Application Name *</Label>
              <StyledInput
                id="app-name"
                placeholder="Enter application name"
                fullWidth
              />
              <HelperText>
                Choose a clear, descriptive name for your application
              </HelperText>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <StyledInput
                id="description"
                placeholder="Describe your application"
                multiline
                rows={4}
                fullWidth
              />
              <HelperText>
                Provide a detailed description of features and benefits
              </HelperText>
            </div>

            {/* Price */}
            <FlexRow>
              <div style={{ flex: 1 }}>
                <Label htmlFor="price">Price *</Label>
                <StyledInput
                  id="price"
                  type="number"
                  placeholder="0.00"
                  fullWidth
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Label htmlFor="category">Category *</Label>
                <StyledInput
                  id="category"
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">Select category</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="crm">CRM</option>
                  <option value="analytics">Analytics</option>
                </StyledInput>
              </div>
            </FlexRow>

            <SectionDivider />

            {/* Form Actions */}
            <FlexRow>
              <Spacer />
              <SecondaryButton>
                Save as Draft
              </SecondaryButton>
              <PrimaryButton type="submit">
                Publish Application
              </PrimaryButton>
            </FlexRow>
          </FlexColumn>
        </form>
      </StyledCard>
    </PageContainer>
  )
}

// ============================================================================
// EXAMPLE 4: Empty State
// ============================================================================

export const EmptyStateExample = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Applications</PageTitle>
      </PageHeader>

      <StyledCard>
        <EmptyState>
          <Apps sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', margin: '0 0 8px 0' }}>
            No applications yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 24px 0', maxWidth: 400 }}>
            Get started by creating your first application. You can add details, set pricing, and publish it to your store.
          </p>
          <PrimaryButton startIcon={<Plus />}>
            Create Your First Application
          </PrimaryButton>
        </EmptyState>
      </StyledCard>
    </PageContainer>
  )
}

// ============================================================================
// EXAMPLE 5: Settings Page
// ============================================================================

export const SettingsExample = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account and preferences</PageSubtitle>
      </PageHeader>

      {/* Profile Section */}
      <StyledCard>
        <SectionTitle>Profile Information</SectionTitle>
        <FlexColumn>
          <FlexRow>
            <div style={{ flex: 1 }}>
              <Label>First Name</Label>
              <StyledInput defaultValue="John" fullWidth />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Last Name</Label>
              <StyledInput defaultValue="Doe" fullWidth />
            </div>
          </FlexRow>
          <div>
            <Label>Email Address</Label>
            <StyledInput
              type="email"
              defaultValue="john@example.com"
              fullWidth
            />
          </div>
          <FlexRow>
            <Spacer />
            <SecondaryButton>Cancel</SecondaryButton>
            <PrimaryButton>Save Changes</PrimaryButton>
          </FlexRow>
        </FlexColumn>
      </StyledCard>

      {/* Notifications Section */}
      <StyledCard sx={{ mt: 3 }}>
        <SectionTitle>Notification Preferences</SectionTitle>
        <FlexColumn>
          <FlexRow>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1E293B', margin: 0 }}>
                Email Notifications
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Receive email updates about your account activity
              </p>
            </div>
            <Spacer />
            {/* Add Switch component here */}
          </FlexRow>
          <FlexRow>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1E293B', margin: 0 }}>
                Marketing Emails
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Receive emails about new features and updates
              </p>
            </div>
            <Spacer />
            {/* Add Switch component here */}
          </FlexRow>
        </FlexColumn>
      </StyledCard>
    </PageContainer>
  )
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default {
  DashboardExample,
  DataTableExample,
  FormExample,
  EmptyStateExample,
  SettingsExample,
}
