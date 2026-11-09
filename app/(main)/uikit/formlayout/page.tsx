'use client';

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { QRCodeSVG } from 'qrcode.react';

interface Empleado {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    puesto: string;
    departamento: string;
    correo: string;
}

// Listas del formulario: edita aquí las opciones
const puestos = ['Desarrollador de software', 'Diseñador UX/UI', 'Analista de datos', 'Líder de proyecto', 'Soporte técnico'];
const departamentos = ['Tecnología', 'Diseño', 'Datos', 'Recursos Humanos', 'Administración'];

const pastel = {
    lila: '#e6defa',
    menta: '#d4f1e4',
    durazno: '#ffe5d6',
    azul: '#d9ebfb',
    texto: '#4a4565'
};

const FormLayoutDemo = () => {
    const [form, setForm] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        puesto: null as string | null,
        departamento: null as string | null,
        correo: ''
    });
    const [contador, setContador] = useState(1);
    const [empleado, setEmpleado] = useState<Empleado | null>(null);

    const actualizar = (campo: string, valor: string | null) => setForm((f) => ({ ...f, [campo]: valor }));

    const completo = form.nombre.trim() && form.apellidoPaterno.trim() && form.puesto && form.departamento && form.correo.trim();

    const generar = () => {
        if (!completo) return;
        setEmpleado({
            id: `EMP-${String(contador).padStart(3, '0')}`,
            nombre: form.nombre.trim(),
            apellidoPaterno: form.apellidoPaterno.trim(),
            apellidoMaterno: form.apellidoMaterno.trim(),
            puesto: form.puesto as string,
            departamento: form.departamento as string,
            correo: form.correo.trim()
        });
        setContador((c) => c + 1);
    };

    const limpiar = () => {
        setForm({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', puesto: null, departamento: null, correo: '' });
        setEmpleado(null);
    };

    const informacionQR = empleado
        ? `Nombre: ${empleado.nombre} ${empleado.apellidoPaterno} ${empleado.apellidoMaterno}\nPuesto: ${empleado.puesto}\nID: ${empleado.id}\nDepartamento: ${empleado.departamento}\nCorreo: ${empleado.correo}`
        : '';

    const iniciales = empleado ? `${empleado.nombre[0] ?? ''}${empleado.apellidoPaterno[0] ?? ''}`.toUpperCase() : '';

    return (
        <div className="grid">
            {/* Formulario vertical */}
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>REGISTRAR EMPLEADO</h5>
                    <div className="field">
                        <label htmlFor="nombre">Nombre(s)</label>
                        <InputText id="nombre" type="text" value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <InputText id="apellidoPaterno" type="text" value={form.apellidoPaterno} onChange={(e) => actualizar('apellidoPaterno', e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <InputText id="apellidoMaterno" type="text" value={form.apellidoMaterno} onChange={(e) => actualizar('apellidoMaterno', e.target.value)} />
                    </div>
                    <div className="field">
                        <label htmlFor="puesto">Puesto</label>
                        <Dropdown id="puesto" value={form.puesto} onChange={(e) => actualizar('puesto', e.value)} options={puestos} placeholder="Selecciona un puesto" />
                    </div>
                    <div className="field">
                        <label htmlFor="departamento">Departamento</label>
                        <Dropdown id="departamento" value={form.departamento} onChange={(e) => actualizar('departamento', e.value)} options={departamentos} placeholder="Selecciona un departamento" />
                    </div>
                    <div className="field">
                        <label htmlFor="correo">Correo</label>
                        <InputText id="correo" type="email" value={form.correo} onChange={(e) => actualizar('correo', e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <Button label="Generar tarjeta" icon="pi pi-id-card" onClick={generar} disabled={!completo} />
                        <Button label="Limpiar" icon="pi pi-refresh" severity="secondary" outlined onClick={limpiar} />
                    </div>
                </div>
            </div>

            {/* Tarjeta digital */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>TARJETA DIGITAL</h5>
                    {!empleado ? (
                        <div className="text-center text-500 py-6">
                            <i className="pi pi-id-card text-5xl mb-3" style={{ color: pastel.lila }}></i>
                            <p>Llena el formulario y presiona “Generar tarjeta”.</p>
                        </div>
                    ) : (
                        <div
                            style={{
                                maxWidth: 320,
                                margin: '0 auto',
                                borderRadius: 24,
                                overflow: 'hidden',
                                background: '#fffdfb',
                                boxShadow: '0 10px 30px rgba(120, 100, 170, 0.18)',
                                color: pastel.texto,
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ background: `linear-gradient(135deg, ${pastel.lila}, ${pastel.azul})`, padding: '24px 16px 56px' }}>
                                <div style={{ fontWeight: 700, letterSpacing: 2, fontSize: 14 }}>TU EMPRESA</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>Identificación de empleado</div>
                            </div>

                            <div
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${pastel.durazno}, ${pastel.menta})`,
                                    border: '5px solid #fffdfb',
                                    margin: '-50px auto 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 34,
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }}
                            >
                                {iniciales}
                            </div>

                            <div style={{ padding: '14px 20px 8px' }}>
                                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                                    {empleado.nombre}
                                    <br />
                                    {empleado.apellidoPaterno} {empleado.apellidoMaterno}
                                </div>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        marginTop: 8,
                                        padding: '4px 14px',
                                        borderRadius: 999,
                                        background: pastel.menta,
                                        fontSize: 13,
                                        fontWeight: 600
                                    }}
                                >
                                    {empleado.puesto}
                                </div>
                            </div>

                            <div style={{ padding: '4px 20px 12px', fontSize: 14, lineHeight: 1.7 }}>
                                <div>
                                    <strong>ID:</strong> {empleado.id}
                                </div>
                                <div>
                                    <strong>Departamento:</strong> {empleado.departamento}
                                </div>
                                <div>
                                    <strong>Correo:</strong> {empleado.correo}
                                </div>
                            </div>

                            <div style={{ background: pastel.durazno, padding: '16px 0 14px' }}>
                                <div style={{ display: 'inline-block', background: '#fff', padding: 8, borderRadius: 12 }}>
                                    <QRCodeSVG value={informacionQR} size={130} level="H" includeMargin={false} />
                                </div>
                                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>Escanea para consultar información</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
