-- Comeaux Lady's Medical Supply Co. - Supabase security migration
-- Apply after db/001_platform.sql on a fresh Supabase project.

create or replace function comeaux.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = comeaux, public
as $$
begin
  insert into comeaux.users(id,email,display_name,role,status)
  values(
    new.id,
    coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'display_name',new.raw_user_meta_data->>'name'),
    'customer',
    'active'
  )
  on conflict(id) do update
    set email=excluded.email,
        display_name=coalesce(excluded.display_name,comeaux.users.display_name),
        updated_at=now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email,raw_user_meta_data on auth.users
for each row execute procedure comeaux.handle_new_auth_user();

alter table comeaux.users enable row level security;
alter table comeaux.products enable row level security;
alter table comeaux.product_variants enable row level security;
alter table comeaux.courses enable row level security;
alter table comeaux.course_modules enable row level security;
alter table comeaux.enrollments enable row level security;
alter table comeaux.learning_attempts enable row level security;
alter table comeaux.attendance_sessions enable row level security;
alter table comeaux.skills_signoffs enable row level security;
alter table comeaux.regulatory_transmittals enable row level security;
alter table comeaux.payment_ledger enable row level security;
alter table comeaux.artifact_registry enable row level security;
alter table comeaux.audit_events enable row level security;

drop policy if exists "users_select_self" on comeaux.users;
create policy "users_select_self" on comeaux.users for select to authenticated using(id=auth.uid());
drop policy if exists "users_update_self" on comeaux.users;
create policy "users_update_self" on comeaux.users for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

drop policy if exists "products_public_read_active" on comeaux.products;
create policy "products_public_read_active" on comeaux.products for select to anon,authenticated using(active=true);
drop policy if exists "variants_public_read_active_product" on comeaux.product_variants;
create policy "variants_public_read_active_product" on comeaux.product_variants for select to anon,authenticated
using(exists(select 1 from comeaux.products p where p.id=product_id and p.active=true));

drop policy if exists "courses_public_read_published" on comeaux.courses;
create policy "courses_public_read_published" on comeaux.courses for select to anon,authenticated using(published=true);
drop policy if exists "modules_public_read_published_course" on comeaux.course_modules;
create policy "modules_public_read_published_course" on comeaux.course_modules for select to anon,authenticated
using(exists(select 1 from comeaux.courses c where c.id=course_id and c.published=true));

drop policy if exists "enrollments_self_read" on comeaux.enrollments;
create policy "enrollments_self_read" on comeaux.enrollments for select to authenticated using(user_id=auth.uid());
drop policy if exists "attempts_self_read" on comeaux.learning_attempts;
create policy "attempts_self_read" on comeaux.learning_attempts for select to authenticated
using(exists(select 1 from comeaux.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()));
drop policy if exists "attendance_self_read" on comeaux.attendance_sessions;
create policy "attendance_self_read" on comeaux.attendance_sessions for select to authenticated
using(exists(select 1 from comeaux.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()));
drop policy if exists "skills_self_read" on comeaux.skills_signoffs;
create policy "skills_self_read" on comeaux.skills_signoffs for select to authenticated
using(exists(select 1 from comeaux.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()));

drop policy if exists "ledger_self_read" on comeaux.payment_ledger;
create policy "ledger_self_read" on comeaux.payment_ledger for select to authenticated using(user_id=auth.uid());

-- No browser policies are intentionally granted for regulatory_transmittals,
-- artifact_registry, or audit_events. Server-side secret-key operations are
-- the controlled path for privileged mutations and evidence writes.
